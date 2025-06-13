import ManageFiles from "./_components/ManageFiles";
export default function MyStuffPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1>My Stuff</h1>
      <p>This is the My Stuff page.</p>
      <div className="w-5/6">
        <ManageFiles />
      </div>
    </div>
  );
}
