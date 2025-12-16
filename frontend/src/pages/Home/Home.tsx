import Container from "@/components/Сontainer";
import ProductList from "@/containers/ProductList";

const Home = () => {
  return (
    <main className="mt-16 pl-20 pr-20">
      <Container>
        <ProductList />
      </Container>
    </main>
  );
};

export default Home;
