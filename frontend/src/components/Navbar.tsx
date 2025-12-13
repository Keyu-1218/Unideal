import { Link } from "react-router-dom";
import Icon from "./Icon";
import Container from "./Сontainer";

const Navbar = () => {
  return (
    <div className="px-8">
      <Container>
        <nav className="flex justify-between mt-3 mb-4 items-center">
          <div className="flex gap-1.5 hover: cursor-pointer">
            <Icon name="logo" />
            <a href="/">
              <div>
                <span className="text-green-dark font-logo text-[30px] font-bold leading-normal">
                  uni
                </span>
                <span className="text-green-light font-logo text-[30px] font-bold leading-normal">
                  deal
                </span>
              </div>
            </a>
          </div>
          <div className="flex gap-5 ">
            <Link to={"/chat"}>
              <Icon name="message" />
            </Link>
            <Link to={"/profile"}>
              <Icon name="profile" />
            </Link>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
