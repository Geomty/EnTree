export default function CreateTreeForm() {
  return (
    <form className="flex justify-start items-center gap-4">
      <input type="text" name="query" placeholder="Enter anything" title="Enter anything" required className="h-9 pl-2 bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg" />
      <button type="submit" className="px-3 py-1 bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg hover:cursor-pointer">Submit</button>
    </form>
  )
}