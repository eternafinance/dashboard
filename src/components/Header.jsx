import styled from "styled-components";
const Menu = styled.ul`
  display: flex;
  li {
    display:inline-block
    margin: 0 1rem;
    a {
      display: block;
      padding: 1rem;
    }
  }
`;
const Header = () => {
  return (
    <header className="p-8 text-primary w-full flex">
      <a href="/" className="block mr-4">
        <img src="/logo.png" alt="logo" className="w-12" />
      </a>
      <Menu>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Projects</a>
        </li>
        <li>
          <a href="#">Echosystem</a>
        </li>
        <li>
          <a href="#">Tckenomics</a>
        </li>
        <li>
          <a href="#">Whitepaper</a>
        </li>
        <li>
          <a href="#">Dashboard</a>
        </li>
      </Menu>
    </header>
  );
};
export default Header;
