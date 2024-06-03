import { RiFilePdf2Fill, RiFilePpt2Fill, RiFileWord2Fill, RiLinkM, RiVideoFill, RiYoutubeFill } from "react-icons/ri";

export const TypeIcon = ({ type }) => {
    let icon = null;
  
    switch (type) {
      case "pptx":
      case "ppt":
        icon = <IconPpt />;
        break;
      case "pdf":
        icon = <IconPdf />;
        break;
      case "youtubeVideo":
        icon = <IconYoutube />;
        break;
      case "video":
        icon = <IconVideo />;
        break;
      case "docx":
        icon = <IconDocx />;
        break;
      case "link":
        icon = <IconExternal />;
        break;
      default:
        icon = <IconDefault />;
    }
  
    return icon;
  };
  
  const IconPpt = () => {
    return <span><RiFilePpt2Fill  size={35} /></span>; // You can replace this with your icon component or JSX
  };
  
  const IconPdf = () => {
    return <span><RiFilePdf2Fill size={35}/></span>; // You can replace this with your icon component or JSX
  };
  
  const IconYoutube = () => {
    return <span><RiYoutubeFill size={35}/></span>; // You can replace this with your icon component or JSX
  };
  
  const IconVideo = () => {
    return <span><RiVideoFill size={35}/></span>; // You can replace this with your icon component or JSX
  };
  
  const IconDocx = () => {
    return <span><RiFileWord2Fill size={35}/></span>; // You can replace this with your icon component or JSX
  };
  
  const IconExternal = () => {
    return <span><RiLinkM size={35}/></span>; // You can replace this with your icon component or JSX
  };
  
  const IconDefault = () => {
    return <span><RiLinkM size={35}/></span>; // You can replace this with your icon component or JSX
  };
  