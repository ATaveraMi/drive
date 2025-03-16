"use client"

import type React from "react"

import { useState } from "react"
import { File, FileText, Folder, Grid, List, Search, Upload } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

// Mock data structure
const initialData = {
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
}

export function DriveUI() {
  const [currentFolder, setCurrentFolder] = useState("root")
  const [path, setPath] = useState([{ id: "root", name: "My Drive" }])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [uploadOpen, setUploadOpen] = useState(false)

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "spreadsheet":
        return <FileText className="h-8 w-8 text-green-500" />
      case "presentation":
        return <FileText className="h-8 w-8 text-orange-500" />
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "archive":
        return <FileText className="h-8 w-8 text-purple-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  // Navigate to a folder
  const navigateToFolder = (folderId: string) => {
    const folder = initialData[folderId]

    // Update path
    if (folderId === "root") {
      setPath([{ id: "root", name: "My Drive" }])
    } else {
      // Find where in the path we are
      const existingIndex = path.findIndex((p) => p.id === folderId)

      if (existingIndex >= 0) {
        // If we're clicking a folder in the breadcrumb, trim the path
        setPath(path.slice(0, existingIndex + 1))
      } else {
        // Add to the path
        setPath([...path, { id: folderId, name: folder.name }])
      }
    }

    setCurrentFolder(folderId)
  }

  // Handle file click
  const handleFileClick = (fileId: string) => {
    // In a real app, this would open the file or download it
    alert(`Opening file: ${initialData[fileId].name}`)
  }

  // Get current folder contents
  const getCurrentFolderContents = () => {
    const folder = initialData[currentFolder]
    if (!folder || !folder.children) return []

    return folder.children.map((id) => ({
      id,
      ...initialData[id],
    }))
  }

  // Mock upload handler
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    setUploadOpen(false)
    alert("File upload simulated! In a real app, this would upload your files.")
  }

  const folderContents = getCurrentFolderContents()

  return (
    <div className="dark">
      <div className="flex h-screen bg-background text-foreground">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search in Drive" className="w-full pl-9" />
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
                      <DialogDescription>Upload files to your current folder.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload}>
                      <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
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
          <div className="p-4 border-b">
            <Breadcrumb>
              <BreadcrumbList>
                {path.map((item, index) => (
                  <BreadcrumbItem key={item.id}>
                    <BreadcrumbLink onClick={() => navigateToFolder(item.id)} className="cursor-pointer">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folderContents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => (item.type === "folder" ? navigateToFolder(item.id) : handleFileClick(item.id))}
                    className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-accent transition-colors"
                  >
                    {item.type === "folder" ? (
                      <Folder className="h-12 w-12 text-blue-500 mb-2" />
                    ) : (
                      <div className="mb-2">{getFileIcon(item.fileType)}</div>
                    )}
                    <div className="text-sm font-medium text-center truncate w-full">{item.name}</div>
                    {item.type === "file" && <div className="text-xs text-muted-foreground mt-1">{item.size}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Modified</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {folderContents.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => (item.type === "folder" ? navigateToFolder(item.id) : handleFileClick(item.id))}
                        className="border-b cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <td className="p-3 flex items-center gap-3">
                          {item.type === "folder" ? (
                            <Folder className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <div className="flex-shrink-0">{getFileIcon(item.fileType)}</div>
                          )}
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">
                          {item.type === "file" ? item.modified : "—"}
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">
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
  )
}

