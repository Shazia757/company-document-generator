type InvoiceItem = {
    description: string;
    quantity: string;
    rate: string;
};

type InvoiceItemsTableProps = {
    value: string;
    onChange: (value: string) => void;
};

function parseItems(value: string): InvoiceItem[] {
    if (!value) {
        return [
            {
                description: "",
                quantity: "1",
                rate: "",
            },
        ];
    }

    try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch {
        // Ignore invalid JSON and use the default row.
    }

    return [
        {
            description: "",
            quantity: "1",
            rate: "",
        },
    ];
}

export default function InvoiceItemsTable({
    value,
    onChange,
}: InvoiceItemsTableProps) {
    const items = parseItems(value);

    function updateItem(
        index: number,
        field: keyof InvoiceItem,
        fieldValue: string
    ) {
        const updatedItems = [...items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: fieldValue,
        };

        onChange(JSON.stringify(updatedItems));
    }

    function addItem() {
        const updatedItems = [
            ...items,
            {
                description: "",
                quantity: "1",
                rate: "",
            },
        ];

        onChange(JSON.stringify(updatedItems));
    }

    function removeItem(index: number) {
        if (items.length === 1) {
            return;
        }

        const updatedItems = items.filter(
            (_, itemIndex) => itemIndex !== index
        );

        onChange(JSON.stringify(updatedItems));
    }

    function getAmount(item: InvoiceItem) {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;

        return quantity * rate;
    }

    return (
        <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-gray-300">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                                Description
                            </th>

                            <th className="w-16 px-2 py-2 text-center text-xs font-semibold text-gray-600">
                                Qty
                            </th>

                            <th className="w-24 px-2 py-2 text-right text-xs font-semibold text-gray-600">
                                Rate
                            </th>

                            <th className="w-24 px-2 py-2 text-right text-xs font-semibold text-gray-600">
                                Amount
                            </th>

                            <th className="w-8" />
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-200"
                            >
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "description",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Item description"
                                        className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 px-2 py-2 text-center text-sm text-gray-900 outline-none focus:border-gray-900"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.rate}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "rate",
                                                event.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        className="w-full rounded-md border border-gray-300 px-2 py-2 text-right text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                                    />
                                </td>

                                <td className="px-2 py-2 text-right text-sm font-medium text-gray-900">
                                    {getAmount(item).toFixed(2)}
                                </td>

                                <td className="px-1">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                        className="rounded px-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                        title="Remove item"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                onClick={addItem}
                className="text-sm font-medium text-gray-700 hover:text-gray-950"
            >
                + Add Item
            </button>
        </div>
    );
}