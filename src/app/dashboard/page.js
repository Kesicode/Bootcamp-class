"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Skeleton } from "../../components/ui/skeleton";
import Link from "next/link";

/**
 * Purpose:
 *   Student dashboard overview. Displays real stats sourced from Convex:
 *   streak from user.streakCount, submission/completion counts from
 *   getMyProgress, and the leaderboard from getLeaderboard.
 *   No mock data is used.
 */
export default function DashboardPage() {
  const user = useQuery(api.users.current);
  const progress = useQuery(api.content.getMyProgress);
  const leaderboard = useQuery(api.users.getLeaderboard);

  const isLoading = user === undefined || progress === undefined || leaderboard === undefined;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-1/3 bg-black/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl bg-black/5" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl bg-black/5" />
          <Skeleton className="h-64 rounded-xl bg-black/5" />
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email?.split('@')[0] || "USER";
  const totalDays = progress?.totalDays || 0;
  const totalTasks = progress?.totalTasks || 0;
  const totalQuizzes = progress?.totalQuizzes || 0;
  const submittedDays = progress?.submittedDays || 0;
  const approvedDays = progress?.approvedDays || 0;
  const quizCompleted = progress?.quizCompleted || 0;

  const submissionPct = totalTasks > 0 ? Math.round((submittedDays / totalTasks) * 100) : 0;
  const approvalPct = totalTasks > 0 ? Math.round((approvedDays / totalTasks) * 100) : 0;
  const quizPct = totalQuizzes > 0 ? Math.round((quizCompleted / totalQuizzes) * 100) : 0;

  // Streak & Rank
  const streak = user?.streakCount || 0;
  const myRank = leaderboard ? leaderboard.findIndex(u => u._id === user?._id) + 1 : 0;
  
  const pendingTasks = progress?.activePendingTasks || 0;

  // Overall Journey
  const overallTotal = totalDays * 3;
  const overallCompleted = submittedDays + approvedDays + quizCompleted;
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-10"
    >
      {/* Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06] pb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] text-black/30 dark:text-white/30 uppercase mb-3">
          SYS_IDENTITY // AUTHENTICATED
        </p>
        <h1 className="text-4xl font-display font-black tracking-tighter uppercase text-black dark:text-white">
          {userName}.
        </h1>
        <p className="text-black/40 dark:text-white/40 mt-2 font-mono text-xs tracking-wider uppercase">
          ROLE_NODE: <span className="text-black dark:text-white font-bold">{user?.role?.toUpperCase() || "STUDENT"}</span> // SYSTEM_ACCESS: GRANTED
        </p>
      </div>

      {/* Stats Grid — all real data */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="STREAK_ACTIVE" value={streak} unit="DAYS" index={0} />
        <StatCard label="TASKS_PENDING" value={pendingTasks} unit="TASKS" index={1} />
        <StatCard label="TASKS_SUBMITTED" value={submittedDays} unit={`/ ${totalTasks}`} index={2} />
        <StatCard label="TASKS_APPROVED" value={approvedDays} unit={`/ ${totalTasks}`} index={3} />
        <StatCard label="QUIZZES_DONE" value={quizCompleted} unit={`/ ${totalQuizzes}`} index={4} />
        <StatCard label="CURRENT_RANK" value={myRank > 0 ? myRank : "-"} unit={myRank > 0 ? `OF ${leaderboard?.length || 0}` : ""} index={5} />
      </div>

      <div className="grid grid-cols-1 gap-8">

        {/* Progress Panel — real percentages */}
        <div>
          <div className="border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-8 bg-[#F8F9FA] dark:bg-[#111111] relative overflow-hidden">
            <div className="absolute top-3 right-4 font-mono text-[8px] text-black/10 dark:text-white/10 pointer-events-none select-none">
              PROGRESS_MATRIX
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-black/30 dark:text-white/30 uppercase mb-2">COGNITIVE_JOURNEY</p>
                <h2 className="text-2xl font-display font-black tracking-tighter uppercase text-black dark:text-white leading-none">
                  Completion Status.
                </h2>
              </div>
              <Link 
                href={progress?.nextDayId ? `/dashboard/days/${progress.nextDayId}` : "/dashboard/days"}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-colors shrink-0"
              >
                CONTINUE_JOURNEY
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            
            <div className="space-y-7">
              <ProgressBar
                label="OVERALL_JOURNEY"
                pct={overallPct}
                detail={`COMPLETED ${overallCompleted} OF ${overallTotal} MILESTONES`}
                delay={0}
                color="bg-black dark:bg-white"
                isMain={true}
              />
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-7">
                <ProgressBar
                  label="TASKS_SUBMITTED"
                  pct={submissionPct}
                  detail={`${submittedDays} of ${totalTasks} tasks`}
                  delay={0.15}
                  color="bg-black/60 dark:bg-white/60"
                />
                <ProgressBar
                  label="TASKS_APPROVED"
                  pct={approvalPct}
                  detail={`${approvedDays} of ${totalTasks} tasks`}
                  delay={0.3}
                  color="bg-green-600"
                />
                <ProgressBar
                  label="QUIZZES_COMPLETED"
                  pct={quizPct}
                  detail={`${quizCompleted} of ${totalQuizzes} quizzes`}
                  delay={0.45}
                  color="bg-black/40 dark:bg-white/40"
                />
              </div>
            </div>

            {totalDays === 0 && (
              <p className="font-mono text-[10px] text-black/25 dark:text-white/25 uppercase tracking-widest mt-6">
                NO_CONTENT_RELEASED // CHECK BACK SOON
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, pct, detail, delay, color, isMain = false }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className={`font-mono uppercase tracking-wider ${isMain ? 'text-xs text-black dark:text-white font-bold' : 'text-[10px] text-black/40 dark:text-white/40'}`}>{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={`font-display font-black text-black dark:text-white leading-none ${isMain ? 'text-4xl' : 'text-2xl'}`}>{pct}%</span>
        </div>
      </div>
      <div className={`w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-1 ${isMain ? 'h-3' : 'h-[2px]'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <p className="font-mono text-[9px] text-black/25 dark:text-white/25 uppercase tracking-wider">{detail}</p>
    </div>
  );
}

function StatCard({ label, value, unit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="border border-black/[0.06] dark:border-white/[0.06] rounded-xl p-6 bg-[#F8F9FA] dark:bg-[#111111] hover:bg-white dark:hover:bg-[#151515] transition-colors relative overflow-hidden"
    >
      <div className="absolute top-2 right-3 font-mono text-[8px] text-black/10 dark:text-white/10 select-none pointer-events-none">NODE</div>
      <p className="font-mono text-[9px] tracking-[0.25em] text-black/30 dark:text-white/30 uppercase mb-3">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display font-black text-4xl tracking-tighter text-black dark:text-white leading-none">{value}</span>
        <span className="font-mono text-[10px] text-black/30 dark:text-white/30 uppercase tracking-wider">{unit}</span>
      </div>
    </motion.div>
  );
}
