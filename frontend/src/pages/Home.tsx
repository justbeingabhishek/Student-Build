import Card from "../components/user/Card";

const Home = () => {
  return (
    <div className="h-full w-full flex py-5 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Lookig for team</h2>
      </div>
      <div className="flex items-center flex-col gap-8">
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
      </div>
    </div>
  );
};

export default Home;
