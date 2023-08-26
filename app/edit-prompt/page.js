"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@components/Navbar";
import Provider from "@components/Provider";

const EditPr = () => {
   const [prompt, setPrompt] = useState({
      title: "",
      prompt: "",
      tags: [],
      tagInput: "", // New state to store the current tag input
   });

   const useSearchParam = useSearchParams();
   const promptId = useSearchParam.get("id");
   const router = useRouter();

   const EditSubmit = async (e) => {
      e.preventDefault();
      // Add your logic for handling form submission here
      if (!promptId) return alert("No prompt id");
      try {
         const res = await fetch(`/api/prompt/${promptId}`, {
            method: "PATCH",
            body: JSON.stringify({
               title: prompt.title,
               prompt: prompt.prompt,
               tags: prompt.tags,
               tagInput: prompt.tagInput,
            }),
         });

         if (res.ok) {
            router.push("/profile");
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleTagInput = (e) => {
      setPrompt({ ...prompt, tagInput: e.target.value });
   };

   const handleAddTag = () => {
      if (prompt.tagInput.trim() !== "") {
         setPrompt({
            ...prompt,
            tags: [...prompt.tags, prompt.tagInput],
            tagInput: "", // Clear the tag input field
         });
      }
   };

   const handleRemoveTag = (index) => {
      setPrompt({
         ...prompt,
         tags: prompt.tags.filter((_, i) => i !== index), //?needs understand
      });
   };

   useEffect(() => {
      const fetchPrompt = async () => {
         const res = await fetch(`/api/prompt/${promptId}`);
         const data = await res.json();
         setPrompt({
            title: data.title,
            prompt: data.prompt,
            tags: data.tags,
            tagInput: "",
         });
      };
      if (promptId) fetchPrompt();
   }, [promptId]);

   return (
      <Provider>
         <Navbar />

         <div
            className="p-2 p-md-5 create-pr"
            style={{ backgroundColor: "#E5E5E5" }}
         >
            <h1>Edit a Prompt</h1>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-md-8">
                     <form onSubmit={EditSubmit}>
                        <div className="mb-3">
                           <label htmlFor="title" className="form-label">
                              Title
                           </label>
                           <input
                              type="text"
                              className="form-control"
                              id="title"
                              value={prompt.title}
                              onChange={(e) =>
                                 setPrompt({
                                    ...prompt,
                                    title: e.target.value,
                                 })
                              }
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="prompt" className="form-label">
                              Prompt
                           </label>
                           <textarea
                              className="form-control"
                              id="prompt"
                              rows={4}
                              value={prompt.prompt}
                              onChange={(e) =>
                                 setPrompt({
                                    ...prompt,
                                    prompt: e.target.value,
                                 })
                              }
                              required
                           />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="tags" className="form-label">
                              Tags
                           </label>
                           <div className="input-group">
                              <input
                                 type="text"
                                 className="form-control"
                                 id="tags"
                                 value={prompt.tagInput}
                                 onChange={handleTagInput}
                              />
                              <button
                                 type="button"
                                 className="btn btn-secondary p-2"
                                 onClick={handleAddTag}
                              >
                                 +
                              </button>
                           </div>
                           {prompt.tags.length > 0 && (
                              <ul className="list-unstyled mt-3">
                                 {prompt.tags.map((tag, index) => (
                                    <li key={index}>
                                       <button
                                          type="button"
                                          className="btn-close "
                                          onClick={() => handleRemoveTag(index)}
                                       >
                                          <span className="visually-hidden"></span>
                                       </button>
                                       <span className="badge bg-secondary p-2">
                                          {tag}
                                       </span>
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>
                        <div className="mt-2 d-flex justify-content-end ">
                           <button type="submit" className="btn btn-primary">
                              Submit
                           </button>
                           <button
                              type="button"
                              className="btn btn-secondary ms-2"
                              onClick={() => router.push("/")}
                           >
                              Cancel
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </Provider>
   );
};

export default EditPr;
