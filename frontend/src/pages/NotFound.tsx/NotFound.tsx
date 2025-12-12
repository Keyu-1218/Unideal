import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>This page does not exist.</h1>
      <Link to={"/"}>
        <Button>Go back home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
