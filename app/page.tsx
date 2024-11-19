import TodoList from "@/sections/todo";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-8 px-4 py-8 pb-20 sm:px-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
        To-Do List
      </h1>
      <TodoList />
    </main>
  );
}
