"use client";

// React
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/providers/user-provider";
import { useSupabase } from "@/hooks/use-supabase";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

//Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceInput, workspaceSchema } from "@/lib/validations/workspace";
import { Workspace, Member } from "@/interfaces/workspace";
import { Profile } from "@/types/supabase";

export function WorkspaceChecker() {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { user, refetchUser } = useUser();
  const { update: updateProfile } = useSupabase<Profile>("profiles");
  const { insert: createWorkspace } = useSupabase<Workspace>("workspaces");
  const { insert: createMember } = useSupabase<Member>("members");

  const form = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (user && user.active_workspace === "") {
      setOpenDialog(true);
    }
  }, [user]);

  const handleCreateWorkspace = async (data: WorkspaceInput) => {
    setLoading(true);
    // Create the workspace
    const workspaceResult = await createWorkspace({
      name: data.name,
      owner_id: user?.id,
    });

    if (workspaceResult && user) {
      // Create the workspace member
      const memberResult = await createMember({
        workspace_id: workspaceResult.id,
        user_id: user.id,
        status: "accepted",
        role: "owner",
      });
      // Update the UserContext
      if (memberResult) {
        await updateProfile(
          { active_workspace: workspaceResult.id },
          { where: [{ column: "user_id", value: user.id }] }
        );
        refetchUser();
      }
    }
    form.reset();
    setLoading(false);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Let’s Get Started! 🎉</DialogTitle>
          <DialogDescription className="text-base">
            Your first workspace is just a click away.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreateWorkspace)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              {...form.register("name")}
              type="text"
              className="col-span-3"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Get started
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
