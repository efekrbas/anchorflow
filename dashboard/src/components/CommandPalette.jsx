import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Send, History, Settings } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const CommandPalette = ({ isOpen, onClose, onNavigate, onSendPayment }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  const runCommand = (command) => {
    handleOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => onNavigate('dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('transfer'))}>
            <Send className="mr-2 h-4 w-4" />
            <span>Go to Transfer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('history'))}>
            <History className="mr-2 h-4 w-4" />
            <span>Go to History</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Go to Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(onSendPayment)}>
            <Send className="mr-2 h-4 w-4" />
            <span>Send Payment</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
