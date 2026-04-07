import { useParams } from "react-router-dom";
import { useUserDetail } from "@/hooks/useUser";
import { formatSnakeCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, Mail, ShieldCheck, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function UserDetail() {
  const { id } = useParams();
  const { data: response, isLoading } = useUserDetail(id as string);
  const user = response?.data;
  const [activeTab, setActiveTab] = useState("attendance");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 " />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center  border border-dashed text-center">
        <div>
          <h2 className="text-xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-1">The user you are looking for does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm">
            <span>#{user.id.slice(0, 8)}</span>
            <span>•</span>
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} className="w-fit">
          {formatSnakeCase(user.status)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className=" border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Mail className="h-4 w-4" />
            Email Address
          </div>
          <div className="text-lg font-bold truncate">{user.email}</div>
        </div>
        <div className=" border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <ShieldCheck className="h-4 w-4" />
            Role
          </div>
          <div className="text-lg font-bold">{formatSnakeCase(user.role)}</div>
        </div>
        <div className=" border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            Last Login
          </div>
          <div className="text-lg font-bold">
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleTimeString() : "Never"}
          </div>
        </div>
        <div className=" border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            Status
          </div>
          <div className="text-lg font-bold uppercase">{user.status}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center border-b">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "attendance" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            Attendance History
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "management" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            Management
          </button>
        </div>

        <div className=" border bg-card p-6">
          {activeTab === "attendance" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Recent Attendance</h3>
                  <p className="text-sm text-muted-foreground">View detailed attendance logs for this user.</p>
                </div>
              </div>
              <div className="h-[300px] flex flex-col items-center justify-center gap-2 border-2 border-dashed  bg-zinc-50/50">
                <Calendar className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground italic text-sm text-center max-w-xs">
                  The attendance module integration is pending. Soon you will see check-in/out maps and logs here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight">Account Management</h3>
              <p className="text-sm text-muted-foreground">Administrative controls and settings.</p>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between p-4  border bg-zinc-50/50">
                  <div>
                    <p className="font-medium">Reset Password</p>
                    <p className="text-xs text-muted-foreground">Send a password reset email to the user.</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4  border bg-zinc-50/50">
                  <div>
                    <p className="font-medium text-destructive">Account Deletion</p>
                    <p className="text-xs text-muted-foreground">Permanently remove this user from the system.</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
