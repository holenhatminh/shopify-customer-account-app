import {
  Button,
  reactExtension,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.order.action.menu-item.render",
  async (api) => {
    const { orderId } = api;
    let hasFulfillments = false;
    try {
      const orderQuery = {
        query: `query {
          order(id: "${orderId}") {
            fulfillments(first: 1) {
              nodes {
                latestShipmentStatus
              }
            }
          }
        }`,
      };
      const result = await fetch(
        "shopify://customer-account/api/latest/graphql.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "X-Shopify-Access-Token": "789a3ab68ae27b5ce6bf79e8402e4762",
          },
          body: JSON.stringify(orderQuery),
        },
      );
      const { data } = await result.json();
      console.log(data);
      hasFulfillments = data.order.fulfillments.nodes.length !== 0;
    } catch (error) {
      console.log(error);
      hasFulfillments = false;
    }
    return (
      <MenuActionExtension showAction={hasFulfillments} orderId={orderId} />
    );
  },
);

function MenuActionExtension({
  showAction,
  orderId,
}: {
  showAction: boolean;
  orderId: string;
}) {
  if (!showAction) {
    return null;
  }
  console.log(orderId);
  return (
    <Button to={`extension:return-page/?orderId=${orderId.split("/").pop()}`}>
      Request return
    </Button>
  );
}
