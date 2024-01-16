import { OrderStatus } from "@/hooks/order"

export default function OrderStatusComp(props: any) {
  if (props.status === OrderStatus.PENDING) {
    return (<span className="px-4 py-1 rounded-md text-sm bg-gray-300 text-gray-900 font-semibold">PENDING</span>)
  }
  if (props.status === OrderStatus.PAID) {
    return (<span className="px-4 py-1 rounded-md text-sm bg-green-300 text-green-900 font-semibold">PAID</span>)
  }
  if (props.status === OrderStatus.FAILED) {
    return (<span className="px-4 py-1 rounded-md text-sm bg-red-300 text-red-900 font-semibold">FAILED</span>)
  }
  return (<></>)
}