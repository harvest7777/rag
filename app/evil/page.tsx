import DragAndDrop from "./_components/DragAndDrop";

export default function EvilPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Evil Page</h1>
      <p>
        This page is protected and should only be accessible to authenticated
        users.
      </p>
      <p>If you see this, it means you are logged in!</p>
      <p>Feel free to explore the rest of the app.</p>
      <DragAndDrop />
    </div>
  );
}
