import Container from "@/components/Сontainer";
import ProductList from "@/containers/ProductList";

const Home = () => {
  return (
    <main className="mt-16">
      <Container>
        <ProductList />
      </Container>
    </main>
  );
};

export default Home;
