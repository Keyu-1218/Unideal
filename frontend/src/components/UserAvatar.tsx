type UserAvatarProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg"; 
};

const sizeClasses = {
  pr: "w-12 h-12 text-lg",
  sm: "w-10 h-10 text-sm", // 40px
  md: "w-14 h-14 text-2xl", // 56px
  lg: "w-20 h-20 text-3xl", // 80px
};

const UserAvatar = ({
  label = "U",
  className = "",
  size = "md",
}: UserAvatarProps) => {
  const firstLetter = label.charAt(0).toUpperCase();

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full 
        text-white 
        font-bold 
        bg-green-dark 
        flex 
        items-center 
        justify-center
        ${className}
      `}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
