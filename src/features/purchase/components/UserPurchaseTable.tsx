
import ActionButton from '@/components/ActionButton';
import { SkeletonArray, SkeletonButton, SkeletonText } from '@/components/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/formatter';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { refundPurchase } from '../actions/purchase';

const UserPurchaseTable = ({
  purchases
}: {
  purchases: {
    id: string,
    pricePaid: number,
    createdAt: Date,
    refundedAt: Date | null,
    productDetails: {
      name: string;
      description: string;
      imageUrl: string;
    }
  }[]
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map(purchase =>
          <TableRow key={purchase.id}>
            <TableCell>
              <div className='flex items-center gap-4'>
                <Image
                  src={purchase.productDetails.imageUrl}
                  alt={purchase.productDetails.name}
                  className='object-cover rounded size-12'
                  width={192}
                  height={192}
                />
                <div className='flex flex-col gap-1'>
                  <p className='font-semibold'>{purchase.productDetails.name}</p>
                  <p className='text-muted-foreground'>{formatDate(purchase.createdAt)}</p>
                </div >
              </div>
            </TableCell>
            <TableCell>
              {
                purchase.refundedAt
                  ? <Badge variant={"outline"}>Refunded</Badge>
                  : formatPrice(purchase.pricePaid / 100)
              }
            </TableCell>
            <TableCell>
             {purchase.refundedAt == null 
             && purchase.pricePaid > 0 
             && (
              <ActionButton 
              action={refundPurchase.bind(null, purchase.id)}
              variant={"destructiveOutline"}
              requireAreYouSure
              >Refund </ActionButton>
             )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default UserPurchaseTable;



export function UserPurchaseTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <SkeletonArray amount={4}>
          <TableRow >
            <TableCell>
              <div className='flex items-center gap-4'>
               <div className='size-12 animate-pulse bg-secondary rounded'></div>
                <div className='flex flex-col gap-1'>
                  <SkeletonText className='w-36' />
                  <SkeletonText className='w-3-4' />
                </div >
              </div>
            </TableCell>
            <TableCell>
 <SkeletonText className='w-12' />
            </TableCell>
            <TableCell>
              <SkeletonButton />
            </TableCell>
          </TableRow>
        </SkeletonArray>
      </TableBody>
    </Table>
  )
}