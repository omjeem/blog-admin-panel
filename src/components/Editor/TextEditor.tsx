"use client";

import ReactQuill from "react-quill-new";
import React, { useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import NewPost from "../../pages/posts/NewPost";


interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image", "link", "video",],
      [{ align: [] }],
    ],
    handlers: {
      video: function (this: any) {
        const url = prompt("Enter video URL:");
        if (url) {
          const caption = prompt("Enter video caption (optional):") || "Video caption...";
          const quill = this.quill;
          const embedUrl = convertToEmbedUrl(url);
          const range = quill.getSelection() || { index: quill.getLength() };

          const videoContainer = document.createElement("div");
          videoContainer.setAttribute(
            "style",
            "display: flex; flex-direction: column; align-items: center; margin: 10px 0;"
          );
          videoContainer.classList.add("video-container");

          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", embedUrl);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "true");
          iframe.classList.add("ql-video");
          iframe.setAttribute("style", "width: 100%; max-width: 560px; height: 315px;");

          const captionElement = document.createElement("p");
          captionElement.textContent = caption;
          captionElement.setAttribute("contenteditable", "true");
          captionElement.setAttribute(
            "style",
            "font-size: 14px; color: #666; text-align: center; margin-top: 5px; outline: none; cursor: text;"
          );

          videoContainer.appendChild(iframe);
          videoContainer.appendChild(captionElement);

          quill.clipboard.dangerouslyPasteHTML(range.index, videoContainer.outerHTML);

          quill.setSelection(range.index + 2);
        }
      },
      image: function (this: any) {
        const quill = this.quill;
        const range = quill.getSelection();
        const url = prompt("Enter image URL:");
        if (url) {
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
        }
      },
    },

  },
};

const convertToEmbedUrl = (url: string) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return url.replace("watch?v=", "embed/");
  } else if (url.includes("vimeo.com")) {
    return url.replace("vimeo.com", "player.vimeo.com/video");
  }
  return url;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  useEffect(() => {
    const quillEditor = document.querySelector(".ql-editor");

    if (!quillEditor) return;

    quillEditor.addEventListener("click", (event: any) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "IMG") {
        document.querySelectorAll(".ql-editor img").forEach((img: any) =>
          img.style.border = "none"
        );
        target.style.border = "2px solid #007bff";
      } else {
        document.querySelectorAll(".ql-editor img").forEach((img: any) =>
          img.style.border = "none"
        );
      }

      const videoWrapper: any = target.closest(".video-container");
      if (videoWrapper) {
        document.querySelectorAll(".video-container").forEach((el: any) =>
          el.style.border = "none"
        );
        videoWrapper.style.border = "2px solid #007bff";
      } else {
        document.querySelectorAll(".video-container").forEach((el: any) =>
          el.style.border = "none"
        );
      }
    });

    quillEditor.addEventListener("keydown", (event: any) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        const selectedImage = document.querySelector(".ql-editor img[style*='border: 2px solid']");
        const selectedVideo = document.querySelector(".video-container[style*='border: 2px solid']");

        if (selectedImage) {
          selectedImage.remove();
          event.preventDefault();
        }

        if (selectedVideo) {
          selectedVideo.remove();
          event.preventDefault();
        }
      }
    });
  }, []);


  return (
    <ReactQuill
      value={content}
      onChange={onChange}
      theme="snow"
      className="bg-white rounded shadow w-full"
      modules={modules}
    />

  );
};

export default RichTextEditor;
