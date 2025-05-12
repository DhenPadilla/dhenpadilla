type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="flex flex-col max-h-[100vh] gap-4 max-w-3xl px-[20vw] w-[100vw] max-w-[100vw] m-auto h-[100vh]">{children}</div>;
};

export default Container;
