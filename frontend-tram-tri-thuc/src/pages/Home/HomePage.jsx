import SearchBar from "../../components/Document/SearchBar";
import CategorySidebar from "../../components/Document/CategorySidebar";
import DocumentList from "../../components/Document/DocumentList";

export default function HomePage() {
    return (
        <div className="flex flex-col md:flex-row p-4 gap-4">
            <aside className="md:w-1/4">
                <CategorySidebar />
            </aside>
            <main className="flex-1">
                <SearchBar />
                <h2 className="text-xl font-bold my-4">📌 Tài liệu nổi bật</h2>
                <DocumentList />
            </main>
        </div>
    );
}
