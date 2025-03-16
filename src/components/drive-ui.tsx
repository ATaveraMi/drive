"use client";

import type React from "react";

import { useState } from "react";
import {
  File,
  FileText,
  Folder,
  Grid,
  List,
  Search,
  Upload,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

// Add these types at the top of the file
type FileType = "document" | "spreadsheet" | "presentation" | "pdf" | "archive";

interface FileItem {
  type: "file";
  name: string;
  size: string;
  modified: string;
  fileType: FileType;
}

interface FolderItem {
  type: "folder";
  name: string;
  children: string[];
}

type DriveItem = FileItem | FolderItem;
type DriveData = Record<string, DriveItem>;

// Mock data structure
const initialData: DriveData = {
  root: {
    type: "folder",
    name: "My Drive",
    children: ["folder1", "folder2", "file1", "file2", "file3"],
  },
  folder1: {
    type: "folder",
    name: "Work Documents",
    children: ["file4", "file5", "folder3"],
  },
  folder2: {
    type: "folder",
    name: "Personal",
    children: ["file6", "file7"],
  },
  folder3: {
    type: "folder",
    name: "Projects",
    children: ["file8", "file9"],
  },
  file1: {
    type: "file",
    name: "Budget 2023.xlsx",
    size: "245 KB",
    modified: "May 12, 2023",
    fileType: "spreadsheet",
  },
  file2: {
    type: "file",
    name: "Presentation.pptx",
    size: "4.2 MB",
    modified: "Jun 3, 2023",
    fileType: "presentation",
  },
  file3: {
    type: "file",
    name: "Notes.docx",
    size: "32 KB",
    modified: "Jul 15, 2023",
    fileType: "document",
  },
  file4: {
    type: "file",
    name: "Report Q2.pdf",
    size: "1.8 MB",
    modified: "Apr 28, 2023",
    fileType: "pdf",
  },
  file5: {
    type: "file",
    name: "Meeting Minutes.docx",
    size: "78 KB",
    modified: "May 5, 2023",
    fileType: "document",
  },
  file6: {
    type: "file",
    name: "Vacation Photos.zip",
    size: "258 MB",
    modified: "Aug 2, 2023",
    fileType: "archive",
  },
  file7: {
    type: "file",
    name: "Resume.pdf",
    size: "420 KB",
    modified: "Jan 15, 2023",
    fileType: "pdf",
  },
  file8: {
    type: "file",
    name: "Project Plan.xlsx",
    size: "156 KB",
    modified: "Mar 22, 2023",
    fileType: "spreadsheet",
  },
  file9: {
    type: "file",
    name: "Code Samples.zip",
    size: "4.5 MB",
    modified: "Feb 8, 2023",
    fileType: "archive",
  },
};

export function DriveUI() {
  const [currentFolder, setCurrentFolder] = useState("root");
  const [path, setPath] = useState([{ id: "root", name: "My Drive" }]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [uploadOpen, setUploadOpen] = useState(false);

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "spreadsheet":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "presentation":
        return <FileText className="h-8 w-8 text-orange-500" />;
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "archive":
        return <FileText className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Navigate to a folder
  const navigateToFolder = (folderId: string) => {
    const folder = initialData[folderId] as FolderItem;
    if (!folder) return;

    // Update path
    if (folderId === "root") {
      setPath([{ id: "root", name: "My Drive" }]);
    } else {
      // Find where in the path we are
      const existingIndex = path.findIndex((p) => p.id === folderId);

      if (existingIndex >= 0) {
        setPath(path.slice(0, existingIndex + 1));
      } else {
        setPath([...path, { id: folderId, name: folder.name }]);
      }
    }

    setCurrentFolder(folderId);
  };

  // Handle file click
  const handleFileClick = (fileId: string) => {
    const file = initialData[fileId];
    if (!file || file.type !== "file") return;

    alert(`Opening file: ${file.name}`);
  };

  // Get current folder contents
  const getCurrentFolderContents = (): (DriveItem & { id: string })[] => {
    const folder = initialData[currentFolder];
    if (!folder || folder.type !== "folder") return [];

    return folder.children
      .map((id) => {
        const item = initialData[id];
        if (!item) return [] as (DriveItem & { id: string })[];
        return { id, ...item };
      })
      .flat();
  };

  // Mock upload handler
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadOpen(false);
    alert(
      "File upload simulated! In a real app, this would upload your files.",
    );
  };

  const folderContents = getCurrentFolderContents();

  return (
    <div className="dark">
      <div className="bg-background text-foreground flex h-screen">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex w-full max-w-md items-center">
                <div className="relative w-full">
                  <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search in Drive"
                    className="w-full pl-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-accent" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-accent" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>

                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload files</DialogTitle>
                      <DialogDescription>
                        Upload files to your current folder.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload}>
                      <div className="my-4 grid w-full max-w-sm items-center gap-1.5">
                        <Input id="file" type="file" multiple />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Upload</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* Breadcrumb */}
          <div className="border-b p-4">
            <Breadcrumb>
              <BreadcrumbList>
                {path.map((item, index) => (
                  <BreadcrumbItem key={item.id}>
                    <BreadcrumbLink
                      onClick={() => navigateToFolder(item.id)}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </BreadcrumbLink>
                    {index < path.length - 1 && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* File/Folder listing */}
          <main className="flex-1 overflow-auto p-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {folderContents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      item.type === "folder"
                        ? navigateToFolder(item.id)
                        : handleFileClick(item.id)
                    }
                    className="hover:bg-accent flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors"
                  >
                    {item.type === "folder" ? (
                      <Folder className="mb-2 h-12 w-12 text-blue-500" />
                    ) : (
                      <div className="mb-2">{getFileIcon(item.fileType)}</div>
                    )}
                    <div className="w-full truncate text-center text-sm font-medium">
                      {item.name}
                    </div>
                    {item.type === "file" && (
                      <div className="text-muted-foreground mt-1 text-xs">
                        {item.size}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="hidden p-3 text-left font-medium md:table-cell">
                        Modified
                      </th>
                      <th className="hidden p-3 text-left font-medium sm:table-cell">
                        Size
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {folderContents.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          item.type === "folder"
                            ? navigateToFolder(item.id)
                            : handleFileClick(item.id)
                        }
                        className="hover:bg-accent/50 cursor-pointer border-b transition-colors"
                      >
                        <td className="flex items-center gap-3 p-3">
                          {item.type === "folder" ? (
                            <Folder className="h-5 w-5 flex-shrink-0 text-blue-500" />
                          ) : (
                            <div className="flex-shrink-0">
                              {getFileIcon(item.fileType)}
                            </div>
                          )}
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="text-muted-foreground hidden p-3 md:table-cell">
                          {item.type === "file" ? item.modified : "—"}
                        </td>
                        <td className="text-muted-foreground hidden p-3 sm:table-cell">
                          {item.type === "file" ? item.size : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
