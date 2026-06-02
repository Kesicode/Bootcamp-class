const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the sections
  const videoStart = content.indexOf('{/* 1. Video */}');
  const taskSubStart = content.indexOf('{/* 2. Task Submission */}');
  const lessonBriefStart = content.indexOf('{/* 3. Lesson Brief */}');
  
  // Find the end of the sections. 
  // The Task Submission ends right before "</div>\n          </div>\n        </div>\n\n        {/* Bottom Section */}"
  // The whole bottom section ends right before "</div>\n      </div>\n    </motion.div>"

  // Actually, let's just do targeted replaces.
  
  // Replace Top Section Grid start
  content = content.replace(
    /\{\/\* Top Section: Video & Task Submission \*\/\}\n\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n\s*<div className="lg:col-span-2 flex flex-col justify-center">/g,
    `<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">\n          {/* Left Column */}\n          <div className="lg:col-span-2 space-y-8">`
  );

  // We need to move the Task Submission block out.
  // Let's capture the Task Submission block.
  const taskSubBlockRegex = /<\!-- TASK_SUB_START -->.*?<\!-- TASK_SUB_END -->/s;
  // Oh, there are no markers.
  
  // Let's use the indices.
  const taskSubHeader = '{/* 2. Task Submission */}';
  const taskSubIndex = content.indexOf(taskSubHeader);
  
  // Find where it ends
  const taskSubEndStr = '              </div>\n            )}\n            </div>\n          </div>\n        </div>\n\n        {/* Bottom Section */}\n        <div className="max-w-3xl mx-auto space-y-8">';
  const taskSubEndIndex = content.indexOf(taskSubEndStr) + taskSubEndStr.length;
  
  const bottomSectionEndStr = '        )}\n        </div>\n      </div>\n    </motion.div>';
  const bottomSectionEndIndex = content.indexOf(bottomSectionEndStr);
  
  if (taskSubIndex === -1 || taskSubEndIndex === -1 || bottomSectionEndIndex === -1) {
    console.error("Could not find sections in " + filePath);
    return;
  }
  
  // Extract task submission block
  let taskSubmissionRaw = content.substring(taskSubIndex, content.indexOf(taskSubEndStr));
  // Clean up the wrappers
  // It starts with:
  // {/* 2. Task Submission */}
  // <div className="border... h-full flex flex-col">
  taskSubmissionRaw = taskSubmissionRaw.replace(/h-full flex flex-col/, '');
  
  // Extract bottom section (Lesson Brief to Task Brief)
  const bottomSectionRaw = content.substring(taskSubEndIndex, bottomSectionEndIndex);
  
  // Now reconstruct
  const prefix = content.substring(0, content.indexOf('<div className="lg:col-span-1">'));
  
  const newContent = prefix + 
    bottomSectionRaw + '\n          </div>\n\n          {/* Right Column */}\n          <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-8">\n            ' +
    taskSubmissionRaw + '              </div>\n            )}\n          </div>\n        </div>\n      </div>\n    </motion.div>\n  );\n}';
    
  fs.writeFileSync(filePath, newContent);
  console.log("Fixed " + filePath);
}

fixFile('src/app/dashboard/days/[dayId]/page.js');
