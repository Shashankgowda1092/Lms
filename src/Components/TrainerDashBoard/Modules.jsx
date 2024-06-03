import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
 
export function Modules({CardName,setIsUserDialogOpen}) {
  const handleUserDialog = () =>{
    setIsUserDialogOpen(true)
  }
  return (
    <Card className="mt-6 w-100 hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out border-l-[4px] border-[#4E73DF]">
      <CardBody>
        <Typography variant="h5" color="black" className="mb-2">
         {CardName}
        </Typography>
        <Typography>
         
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button onClick={handleUserDialog}>open</Button>
      </CardFooter>
    </Card>
  );
}