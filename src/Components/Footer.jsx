import { Typography } from "@material-tailwind/react";
import useAuth from "../Hooks/useAuth";

export function Footer() {
  const { auth } = useAuth();
  return (
    <footer className="fixed bottom-0 w-full bg-white p-8">
      <Typography color="blue-gray" className="text-center font-normal" style={{ userSelect: "none" }}>
        &copy; 2024 Batch-103
      </Typography>
    </footer>
  );
}
