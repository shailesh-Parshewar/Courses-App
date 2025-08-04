import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatPlural, formatPrice } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";


const PurchaseTable = ({
    purchases
}: {
    purchases: {
        id: string;
        createdAt: Date;
        pricePaid: number;
        productDetails: {
            name: string;
            description: string;
            imageUrl: string;
        };
        refundedAt: Date | null;
        user: {
            name: string;
        };
    }[]
}) => {
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{" "}{
                    formatPlural(purchases.length, {
                        singular: "Sale",
                        plural: "Sales"
                    })
                }</TableHead>
                <TableHead>Customer name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {purchases.map(purchase => (
                <TableRow key={purchase.id}>
                    <TableCell>
                        <div className="flex items-center gap-4">
                            <Image
                                src={purchase.productDetails.imageUrl}
                                alt={purchase.productDetails.name}
                                width={192}
                                height={192}
                                className="object-cover rounded size-12"
                            />

                            <div className="flex flex-col items-start gap-1" >
                                <div>
                                    <p className="font-semibold">{purchase.productDetails.name}</p>
                                </div>
                                <div className="text-muted-foreground">
                                    {formatDate(purchase.createdAt)}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{purchase.user.name}</TableCell>
                    <TableCell>{
                        purchase.refundedAt ? (
                            <Badge variant={"outline"}>Refunded</Badge>
                        ) : (
                            formatPrice(purchase.pricePaid / 100)
                        )}
                        </TableCell>
<TableCell>
    <Button variant={"outline"} asChild>
        <Link href={`/purchases/${purchase.id}`}>Details</Link>
    </Button>
</TableCell>

                </TableRow>
            ))
            }
        </TableBody>
    </Table>
}

export default PurchaseTable