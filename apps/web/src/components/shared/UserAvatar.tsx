import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  user?: { name?: string | null; avatar?: string | null } | null
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
      <AvatarFallback>
        {user?.name
          ? user.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "U"}
      </AvatarFallback>
    </Avatar>
  )
}
