"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

/**
 * User Actions Component
 * 
 * Dropdown menu with admin actions for each user:
 * - Change role (admin/user)
 * - Ban/Unban user
 * - Delete user
 */
interface UserActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    banned?: boolean;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleRole = async () => {
    setLoading(true);
    const newRole = user.role === "admin" ? "user" : "admin";
    
    await authClient.admin.setRole({
      userId: user.id,
      role: newRole,
    });
    
    setLoading(false);
    router.refresh();
  };

  const handleToggleBan = async () => {
    setLoading(true);
    
    if (user.banned) {
      await authClient.admin.unbanUser({ userId: user.id });
    } else {
      await authClient.admin.banUser({
        userId: user.id,
        banReason: "Banned by admin",
      });
    }
    
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setLoading(true);
    
    await authClient.admin.removeUser({ userId: user.id });
    
    setLoading(false);
    setDeleteDialogOpen(false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={loading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggleRole}>
            {user.role === "admin" ? "Remove Admin" : "Make Admin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleBan}>
            {user.banned ? "Unban User" : "Ban User"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
