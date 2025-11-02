import React, { useEffect, useState, useMemo } from "react";
import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Logo from "./Logo";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
} from 'chart.js';
import CountUp from "./ui/CountUp";
import InfoTooltip from "./ui/InfoTooltip";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DisplayInfo = () => {
  const { user } = usePrivy();
  const { fetchUserRecords, records, fetchUserByEmail } = useStateContext();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    aiPersonalizedTreatment: 0,
    totalScreenings: 0,
    completedScreenings: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
  });

  const [taskStatusData, setTaskStatusData] = useState({
    todo: 0,
    doing: 0,
    done: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user.email.address)
        .then(() => {
          const totalFolders = records.length;
          let aiPersonalizedTreatment = 0;
          let totalScreenings = 0;
          let completedScreenings = 0;
          let pendingScreenings = 0;
          let overdueScreenings = 0;
          let todoCount = 0;

          records.forEach((record) => {
            if (record.kanbanRecords) {
              try {
                const kanban = JSON.parse(record.kanbanRecords);
                aiPersonalizedTreatment += kanban.columns.some(
                  (column) => column.title === "AI Personalized Treatment",
                )
                  ? 1
                  : 0;
                totalScreenings += kanban.tasks.length;
                completedScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "done",
                ).length;
                pendingScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "doing",
                ).length;
                overdueScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "overdue",
                ).length;
                todoCount += kanban.tasks.filter(
                  (task) => task.columnId === "todo",
                ).length;
              } catch (error) {
                console.error("Failed to parse kanbanRecords:", error);
              }
            }
          });

          setTaskStatusData({
            todo: todoCount,
            doing: pendingScreenings,
            done: completedScreenings,
            overdue: overdueScreenings,
          });

          setMetrics({
            totalFolders,
            aiPersonalizedTreatment,
            totalScreenings,
            completedScreenings,
            pendingScreenings,
            overdueScreenings,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user, fetchUserRecords, records]);

  // Prepare record progress data for charts
  const recordProgressData = useMemo(() => {
    const data = records.map((record, index) => {
      let completed = 0;
      let total = 0;

      if (record.kanbanRecords) {
        try {
          const kanban = JSON.parse(record.kanbanRecords);
          total = kanban.tasks?.length || 0;
          completed = kanban.tasks?.filter(task => task.columnId === "done").length || 0;
        } catch (error) {
          console.error("Failed to parse kanbanRecords:", error);
        }
      }

      return {
        name: record.recordName?.substring(0, 10) || `Record ${index + 1}`,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    return data;
  }, [records]);

  // Chart.js configurations with modern styling
  const taskStatusChartData = {
    labels: ['Todo', 'In Progress', 'Completed', 'Overdue'],
    datasets: [
      {
        data: [taskStatusData.todo, taskStatusData.doing, taskStatusData.done, taskStatusData.overdue],
        backgroundColor: [
          'rgba(139, 92, 246, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 3,
      },
    ],
  };

  const recordProgressChartData = {
    labels: recordProgressData.map(r => r.name),
    datasets: [
      {
        label: 'Completion %',
        data: recordProgressData.map(r => r.percentage),
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 0,
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  const completionTrendData = {
    labels: recordProgressData.map(r => r.name),
    datasets: [
      {
        label: 'Completed Tasks',
        data: recordProgressData.map(r => r.completed),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 7,
        pointHoverRadius: 9,
        borderWidth: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#1f2937',
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.96)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        padding: 14,
        cornerRadius: 12,
        titleFont: {
          size: 14,
          weight: '700',
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
          callback: function(value) {
            return value + '%';
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#1f2937',
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.96)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        padding: 14,
        cornerRadius: 12,
        titleFont: {
          size: 14,
          weight: '700',
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    cutout: '65%',
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#1f2937',
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.96)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        padding: 14,
        cornerRadius: 12,
        titleFont: {
          size: 14,
          weight: '700',
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Carenetai Branding */}
      <div className="rounded-3xl p-8 shadow-premium-lg relative overflow-hidden animate-fade-in-up" style={{ background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <Logo size="large" showText={false} />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold font-jakarta">Carenetai</h1>
              <p className="text-white/90 text-sm italic">A community for cancer</p>
            </div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2 font-jakarta">Welcome to Your Healthcare Dashboard</h2>
          <p className="text-white/90 text-base">Track your medical records, screenings, and treatment progress all in one place</p>
        </div>
      </div>
            
      {/* Modern Stats Cards */}
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 overflow-hidden card-hover">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(31, 78, 137, 0.1), rgba(46, 107, 168, 0.2))' }}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)', boxShadow: '0 10px 25px rgba(31, 78, 137, 0.3)' }}>
                      <IconFolder size={26} />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-glow" style={{ backgroundColor: '#1F4E89' }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900 font-jakarta">
                      <CountUp from={0} to={metrics.totalFolders} duration={0.8} />
                    </p>
                    <p className="text-sm font-semibold text-gray-700">Total Records</p>
                    <p className="text-xs text-gray-500">Medical records stored</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 overflow-hidden card-hover">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(46, 107, 168, 0.1), rgba(74, 139, 194, 0.2))' }}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #2E6BA8, #4A8BC2)', boxShadow: '0 10px 25px rgba(46, 107, 168, 0.3)' }}>
                      <IconUserScan size={26} />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-glow" style={{ backgroundColor: '#2E6BA8' }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900 font-jakarta">
                      <CountUp from={0} to={metrics.totalScreenings} duration={0.8} delay={0.1} />
                    </p>
                    <p className="text-sm font-semibold text-gray-700">Total Tasks</p>
                    <p className="text-xs text-gray-500">Treatment tasks tracked</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 overflow-hidden card-hover">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(74, 139, 194, 0.1), rgba(107, 165, 217, 0.2))' }}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)', boxShadow: '0 10px 25px rgba(74, 139, 194, 0.3)' }}>
                      <IconCircleDashedCheck size={26} />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-glow" style={{ backgroundColor: '#4A8BC2' }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900 font-jakarta">
                      <CountUp from={0} to={metrics.completedScreenings} duration={0.8} delay={0.15} />
                    </p>
                    <p className="text-sm font-semibold text-gray-700">Completed</p>
                    <p className="text-xs text-gray-500">Successfully finished</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 overflow-hidden card-hover">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(107, 165, 217, 0.1), rgba(165, 201, 240, 0.2))' }}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #6BA5D9, #A5C9F0)', boxShadow: '0 10px 25px rgba(107, 165, 217, 0.3)' }}>
                      <IconHourglassHigh size={26} />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-glow" style={{ backgroundColor: '#6BA5D9' }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900 font-jakarta">
                      <CountUp from={0} to={metrics.pendingScreenings} duration={0.8} delay={0.2} />
                    </p>
                    <p className="text-sm font-semibold text-gray-700">In Progress</p>
                    <p className="text-xs text-gray-500">Currently active</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
                      <IconAlertCircle size={26} />
                    </div>
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-glow"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900 font-jakarta">
                      <CountUp from={0} to={metrics.overdueScreenings} duration={0.8} delay={0.25} />
                    </p>
                    <p className="text-sm font-semibold text-gray-700">Overdue</p>
                    <p className="text-xs text-gray-500">Requires attention</p>
                  </div>
                </div>
              </div>
            </div>

      {/* Charts Section */}
      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Distribution */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/40 p-7 transition-all duration-500 hover:shadow-premium-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl" style={{ background: 'linear-gradient(to right, #1F4E89, #4A8BC2, #6BA5D9)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(31, 78, 137, 0.05), rgba(74, 139, 194, 0.1))' }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #1F4E89, #4A8BC2)', boxShadow: '0 10px 25px rgba(31, 78, 137, 0.3)' }}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-jakarta">Task Status Distribution</h3>
              <InfoTooltip
                content={
                  <div>
                    <div className="font-semibold mb-2">Task Status Overview:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Todo:</strong> Tasks not yet started</li>
                      <li>• <strong>In Progress:</strong> Currently active tasks</li>
                      <li>• <strong>Completed:</strong> Finished tasks</li>
                      <li>• <strong>Overdue:</strong> Tasks needing attention</li>
                    </ul>
                  </div>
                }
              />
              </div>
              <div className="h-72 relative mt-4">
                {metrics.totalScreenings > 0 ? (
                  <Doughnut data={taskStatusChartData} options={doughnutOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">📊</span>
                      </div>
                      <p className="text-base font-semibold text-gray-700 mb-1">No task data available</p>
                      <p className="text-sm text-gray-500">Add tasks to see distribution</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Record Progress */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/40 p-7 transition-all duration-500 hover:shadow-premium-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl" style={{ background: 'linear-gradient(to right, #1F4E89, #4A8BC2, #6BA5D9)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(31, 78, 137, 0.05), rgba(74, 139, 194, 0.1))' }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #2E6BA8, #6BA5D9)', boxShadow: '0 10px 25px rgba(46, 107, 168, 0.3)' }}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-jakarta">Record Completion</h3>
              <InfoTooltip
                content={
                  <div>
                    <div className="font-semibold mb-2">Record Progress:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Shows completion percentage for each record</li>
                      <li>• Based on tasks marked as done</li>
                      <li>• Track your treatment progress</li>
                    </ul>
                  </div>
                }
              />
              </div>
              <div className="h-72 relative mt-4">
                {records.length > 0 ? (
                  <Bar data={recordProgressChartData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">📈</span>
                      </div>
                      <p className="text-base font-semibold text-gray-700 mb-1">No records available</p>
                      <p className="text-sm text-gray-500">Create records to track progress</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/40 p-7 transition-all duration-500 hover:shadow-premium-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl" style={{ background: 'linear-gradient(to right, #1F4E89, #4A8BC2, #A5C9F0)' }}></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(31, 78, 137, 0.05), rgba(107, 165, 217, 0.1))' }}></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #4A8BC2, #A5C9F0)', boxShadow: '0 10px 25px rgba(74, 139, 194, 0.3)' }}>
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-jakarta">Treatment Progress Trend</h3>
            <InfoTooltip
              content={
                <div>
                  <div className="font-semibold mb-2">Progress Tracking:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• Track completed tasks across records</li>
                    <li>• Visualize your treatment journey</li>
                    <li>• Monitor overall progress</li>
                  </ul>
                </div>
              }
            />
            </div>
            <div className="h-80 relative mt-4">
              {records.length > 0 ? (
                <Line data={completionTrendData} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl">📉</span>
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-1">No trend data available</p>
                    <p className="text-sm text-gray-500">Complete tasks to see trends</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayInfo;
