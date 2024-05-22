import React, { useState, useEffect } from "react";
import styles from '../../Pages/Home/Home.module.css';
import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import axios from "axios";
import FileSaver from 'file-saver';
import "quill/dist/quill.snow.css"; // import the styles
import ReactQuill from "react-quill"; // import the library
import { Document, Packer, Paragraph } from 'docx';



const Editor = () => {
  const [content, setContent] = useState("");
  const [userDetails, setUserDetails] = useState({});
// console.log("-------------------------------")
let gotten = JSON.parse(localStorage.getItem("gunduauser"));

let UserDetails = gotten.data
// console.log (UserDetails.key)
  useEffect(() => {
    axios
      .get("http://192.168.10.12:5000/files/", {
        // headers: {
        //   'Authorization': `Token ${UserDetails.key}`,
        // },
      })
      .then((response) => {
        setContent(response.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {

    event.preventDefault();

    axios.post("http://192.168.10.12:5000/files/", { content: content }, {
        
      headers: {
        'Authorization': `Token ${UserDetails.key}`,
        },
      })
      .then((response) => {
        console.log(response);
        alert("Content saved successfully");
      })
      .catch((error) => {
        console.log(error);
        alert("Error saving content: " + error);
      });
  };

  const createWordDocument = (content) => {
    const doc = new Document();
    doc.add(new Paragraph(content));
    return doc;
  };

  
  const handleDownload = () => {
    let blob = new Blob([content], { type: "application/msword" });
    FileSaver.saveAs(blob, "document.dooh cx");
  };

  return (
    <div className={styles.Summaries} data-testid="Docs">
      <Header title="Text Editor"></Header>
      <Sidebar  ></Sidebar>
      <div className="content-body">
        <div className="container-fluid">
          <div className="page-titles">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="javascript:void(0)">Form</a>
              </li>
              <li className="breadcrumb-item active">
                <a href="javascript:void(0)">Editor</a>
              </li>
            </ol>
          </div>
          <div className="row">
            <div className="col-xl-12 col-xxl-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Write your text here</h4>
                </div>
                <div className="card-body">
                  <ReactQuill value={content} onChange={setContent} />
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Save
                  </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="btn btn-primary" onClick={handleDownload}>
                  Download as Word
                  </button>
                </div>
                <div className="card-footer">
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>
        {`
          .ql-container {
            height: 250px; // increase the height of the container
          }
        `}
      </style>
      </div>
    </div>
  );
};

export default Editor;
