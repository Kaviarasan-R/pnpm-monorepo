export default function Home() {
  console.log('hello world');
  return <h1>Hello world - {process.env.NEXT_PUBLIC_KEY}</h1>;
}
