import { company } from "@/lib/company";

type SidebarProps = {
    activeTab: "new" | "history";
    setActiveTab: (tab: "new" | "history") => void;
};

export default function Sidebar({
    activeTab,
    setActiveTab,
}: SidebarProps) {
    return (
        <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-gray-200 px-5">
                <div>
                    <h1 className="text-sm font-semibold text-gray-900">
                        Company Docs
                    </h1>

                    <p className="text-xs text-gray-500">
                        Document Generator
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Workspace
                </p>

                <button
                    type="button"
                    onClick={() => setActiveTab("new")}
                    className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === "new"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    <span className="text-base">+</span>
                    New Document
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activeTab === "history"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    <span className="text-base">◷</span>
                    History
                </button>
            </nav>

            {/* Company */}
            <div className="border-t border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-900">
                    {company.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Internal Document System
                </p>
            </div>
        </aside>
    );
}