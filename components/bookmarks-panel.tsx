"use client"

import { useState } from "react"
import type { Bookmark, Highlight } from "@/types/reader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookmarkIcon, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

type BookmarksPanelProps = {
  bookmarks: Bookmark[]
  highlights: Highlight[]
  onBookmarkClick: (bookmark: Bookmark) => void
  onHighlightClick: (highlight: Highlight) => void
  onDeleteBookmark: (bookmarkId: string) => void
  onDeleteHighlight: (highlightId: string) => void
  onClose: () => void
}

export function BookmarksPanel({
  bookmarks,
  highlights,
  onBookmarkClick,
  onHighlightClick,
  onDeleteBookmark,
  onDeleteHighlight,
  onClose,
}: BookmarksPanelProps) {
  const [activeTab, setActiveTab] = useState("bookmarks")

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bookmarks & Highlights</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="bookmarks">Bookmarks ({bookmarks.length})</TabsTrigger>
          <TabsTrigger value="highlights">Highlights ({highlights.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="flex-1">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {bookmarks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookmarkIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No bookmarks yet</p>
                <p className="text-sm mt-2">Tap the bookmark icon while reading to add one</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((bookmark) => (
                    <div key={bookmark.id} className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className="text-sm font-medium cursor-pointer flex-1"
                          onClick={() => onBookmarkClick(bookmark)}
                        >
                          {bookmark.text || `Page ${bookmark.pageNumber}`}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDeleteBookmark(bookmark.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-400">
                        Page {bookmark.pageNumber} • {formatDistanceToNow(bookmark.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="highlights" className="flex-1">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {highlights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="h-12 w-12 mx-auto mb-2 opacity-30 flex items-center justify-center">
                  <div className="h-8 w-8 bg-yellow-500/30 rounded"></div>
                </div>
                <p>No highlights yet</p>
                <p className="text-sm mt-2">Select text while reading to highlight it</p>
              </div>
            ) : (
              <div className="space-y-3">
                {highlights
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((highlight) => (
                    <div key={highlight.id} className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className={cn(
                            "text-sm cursor-pointer flex-1",
                            highlight.color === "yellow" && "border-l-4 border-yellow-500 pl-2",
                            highlight.color === "green" && "border-l-4 border-green-500 pl-2",
                            highlight.color === "blue" && "border-l-4 border-blue-500 pl-2",
                            highlight.color === "pink" && "border-l-4 border-pink-500 pl-2",
                          )}
                          onClick={() => onHighlightClick(highlight)}
                        >
                          {highlight.text}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDeleteHighlight(highlight.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {highlight.note && (
                        <div className="text-sm bg-gray-700 p-2 rounded mb-2 italic">{highlight.note}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        Page {highlight.pageNumber} • {formatDistanceToNow(highlight.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

