import Container from "@/components/Сontainer";
import ProductList from "@/containers/ProductList";

const Home = () => {
  return (
    <main className="mt-16 pl-8 pr-8">
      <Container>
        <ProductList />
      </Container>
    </main>
  );
};

export default Home;
