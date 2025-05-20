"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Copy, Facebook, Linkedin, Twitter } from "lucide-react"

type ShareDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  url: string
}

export function ShareDialog({ open, onOpenChange, title, url }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
        toast({
          title: "Shared successfully",
        })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Failed to share",
            description: "Could not share the content",
            variant: "destructive",
          })
        }
      }
    } else {
      handleCopy()
    }
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Share this content with others</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input value={url} readOnly className="w-full" />
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>

          {/* Native share button (mobile) */}
          {navigator.share && (
            <Button onClick={handleShare} className="w-full">
              Share
            </Button>
          )}

          {/* Social media share buttons */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500">Share on social media</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={shareToTwitter} className="flex-1">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="icon" onClick={shareToFacebook} className="flex-1">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="icon" onClick={shareToLinkedin} className="flex-1">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

