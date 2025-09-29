import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const Avatar = ({
  src,
  alt,
  name,
  size = "md",
  className = "",
  showOnlineStatus = false,
  isOnline = false,
  animation = true,
  ...props
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name) => {
    if (!name) return "bg-gray-400";
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      initial={animation ? { scale: 0 } : {}}
      animate={animation ? { scale: 1 } : {}}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      {...props}
    >
      <div className={cn("relative rounded-full overflow-hidden", sizes[size])}>
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={cn(
            "w-full h-full flex items-center justify-center text-white font-semibold",
            getBackgroundColor(name),
            src ? "hidden" : "flex"
          )}
        >
          {getInitials(name)}
        </div>
      </div>
      {showOnlineStatus && (
        <motion.div
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </motion.div>
  );
};

// Avatar Group Component
export const AvatarGroup = ({
  avatars,
  maxVisible = 3,
  size = "md",
  className = "",
  ...props
}) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className="border-2 border-white dark:border-gray-800"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center text-white font-semibold bg-gray-500 border-2 border-white dark:border-gray-800",
            size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
