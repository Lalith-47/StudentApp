import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "../../utils/helpers";

const Chart = ({
  children,
  className = "",
  title = "",
  description = "",
  animation = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700",
        className
      )}
      initial={animation ? { opacity: 0, y: 20 } : {}}
      animate={animation ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

// Bar Chart Component
export const BarChartComponent = ({
  data,
  dataKey,
  nameKey,
  color = "#3b82f6",
  height = 300,
  showGrid = true,
  ...props
}) => {
  return (
    <Chart {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          )}
          <XAxis
            dataKey={nameKey}
            className="text-xs fill-gray-500"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-xs fill-gray-500" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            className="drop-shadow-sm"
          />
        </BarChart>
      </ResponsiveContainer>
    </Chart>
  );
};

// Pie Chart Component
export const PieChartComponent = ({
  data,
  dataKey,
  nameKey,
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  height = 300,
  showLegend = true,
  ...props
}) => {
  return (
    <Chart {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          {showLegend && <Tooltip />}
        </PieChart>
      </ResponsiveContainer>
    </Chart>
  );
};

// Line Chart Component
export const LineChartComponent = ({
  data,
  dataKey,
  nameKey,
  color = "#3b82f6",
  height = 300,
  showGrid = true,
  showArea = false,
  ...props
}) => {
  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <Chart {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          )}
          <XAxis
            dataKey={nameKey}
            className="text-xs fill-gray-500"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-xs fill-gray-500" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          {showArea ? (
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </Chart>
  );
};

// Progress Ring Component
export const ProgressRing = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  showPercentage = true,
  label = "",
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      className={cn("flex flex-col items-center", className)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
          {label}
        </p>
      )}
    </motion.div>
  );
};

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  color = "blue",
  animation = true,
  delay = 0,
  ...props
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-100 dark:bg-green-900/20",
    red: "text-red-600 bg-red-100 dark:bg-red-900/20",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-700"
      initial={animation ? { opacity: 0, y: 20 } : {}}
      animate={animation ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {changeType === "positive" ? "+" : ""}
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        )}
      </div>
    </motion.div>
  );
};

export default Chart;
