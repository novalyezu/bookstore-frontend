"use client"

import OrderStatusComp from "@/components/order/OrderStatus";
import { formatUSD } from "@/helper/utils";
import { IOrderData, OrderStatus, useOrderAdmin } from "@/hooks/orderAdmin";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const TableAction = (props: any) => {
  const { deleteOrder } = useOrderAdmin()

  const handleClickDelete = () => {
    const ok = confirm('Are you sure to delete this order?')
    if (ok) {
      deleteOrder(props.rowId)
    }
  }

  return (
    <div className="flex gap-2">
      <Link className="bg-yellow-700 text-white rounded-sm px-2 py-1 font-semibold" href={'/admin/order/' + props.rowId}>Detail</Link>
      {props.status === OrderStatus.PENDING &&
        <>
          <Link className="bg-blue-700 text-white rounded-sm px-2 py-1 font-semibold" href={'/admin/order/update/' + props.rowId}>Edit</Link>
          <button className="bg-red-700 text-white rounded-sm px-2 py-1 font-semibold" onClick={handleClickDelete}>Delete</button>
        </>
      }
    </div>
  )
}

const columns = [
  {
    name: 'Buyer Name',
    selector: (row: IOrderData) => row.buyer_name,
  },
  {
    name: 'Buyer Email',
    selector: (row: IOrderData) => row.buyer_email,
  },
  {
    name: 'Total Amount',
    selector: (row: IOrderData) => formatUSD(row.total_amount),
  },
  {
    name: 'Status',
    cell: (row: IOrderData) => <OrderStatusComp status={row.order_status} />,
  },
  {
    name: 'Action',
    cell: (row: IOrderData) => <TableAction rowId={row.id} status={row.order_status} />
  },
];

export default function Order() {
  const { isLoading, orders, getOrders, pagination } = useOrderAdmin()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderBy, setOrderBy] = useState("createdAt__desc")
  const [search, setSearch] = useState("")
  let ignore = false;

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const onKeyDownSearchInput = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      getOrders({ page, limit, orderBy, search });
    }
  }

  const handlePageChange = (page: any) => {
    setPage(page)
  }

  const handlePerRowsChange = async (newPerPage: any, page: any) => {
    setPage(page)
    setLimit(newPerPage)
  }

  useEffect(() => {
    if (!ignore) {
      getOrders({ page, limit, orderBy, search });
    }
    return () => {
      ignore = true
    }
  }, [page, limit])

  useEffect(() => {
    if (!ignore) {
      getOrders({ page, limit, orderBy, search });
    }
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div>
      <div className="flex justify-between mb-3">
        <div className="text-2xl">Orders</div>
        <div className="relative">
          <svg className="fill-gray-500 absolute top-5 left-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" role="img">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.6002 12.0498C9.49758 12.8568 8.13777 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667C0 2.98477 2.98477 0 6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 8.15637 12.8447 9.53194 12.019 10.6419C12.0265 10.6489 12.0338 10.656 12.0411 10.6633L15.2935 13.9157C15.6841 14.3063 15.6841 14.9394 15.2935 15.33C14.903 15.7205 14.2699 15.7205 13.8793 15.33L10.6269 12.0775C10.6178 12.0684 10.6089 12.0592 10.6002 12.0498ZM11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z"></path>
          </svg>
          <input type="text" className="w-[28rem] py-3 pl-12 pr-5 rounded-md border-2 border-gray-900" placeholder="Search..." onChange={onChangeSearchInput}
            onKeyDown={onKeyDownSearchInput}></input>
        </div>
        <div>
          <Link href="/admin/order/create" className="p-3 text-white bg-gray-900 rounded-xl">+ Create Order</Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        progressPending={isLoading}
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalData}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
};
