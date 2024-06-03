import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
  } from "@material-tailwind/react";
  // eslint-disable-next-line no-unused-vars
  import { BsFillPersonCheckFill } from "react-icons/bs";
  import PropTypes from "prop-types";
  const DeletedModal = ({ submitted }) => {
    return (
      <>
        <Dialog
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          open={submitted}
          className="max-w-xs mx-auto rounded-lg rounded-t-lg"
        >
          <DialogHeader className="bg-red-500 text-white rounded-t-lg">
            Deleted Employees.
          </DialogHeader>
          <DialogBody className="flex items-center justify-center space-x-2">
            <BsFillPersonCheckFill className="text-red-500 text-7xl" />
          </DialogBody>
          <Typography className="text-lg text-center" variant="h5">
            Deleted the employees from batch
          </Typography>
  
          <DialogFooter></DialogFooter>
        </Dialog>
      </>
    );
  };
  DeletedModal.propTypes = {
    submitted: PropTypes.bool,
  };
  
  export default DeletedModal;
  