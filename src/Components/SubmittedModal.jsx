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
const SubmittedModal = ({ submitted }) => {
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
        <DialogHeader className="bg-green-500 text-white rounded-t-lg">
          Submitted
        </DialogHeader>
        <DialogBody className="flex items-center justify-center space-x-2">
          <BsFillPersonCheckFill className="text-green-500 text-7xl" />
        </DialogBody>
        <Typography className="text-lg text-center" variant="h5">
          Submitted the attendance
        </Typography>

        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
};
SubmittedModal.propTypes = {
  submitted: PropTypes.bool,
};

export default SubmittedModal;
