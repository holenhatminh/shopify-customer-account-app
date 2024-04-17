import {
  Image,
  Text,
  Page,
  reactExtension,
  Button,
  Card,
  // useApi,
  InlineLayout,
  ChoiceList,
  BlockStack,
  Choice,
  Spinner,
  BlockSpacer,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect, useState } from "react";
import { formatDate } from "./share/datetime";
import { formatMoney } from "./share/currency";

export default reactExtension("customer-account.page.render", () => (
  <ReturnPage />
));

function ReturnPage() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  async function fetchOrder() {
    setLoading(true);

    try {
      const orderQuery = {
        query: `query {
          order(id: "gid://shopify/Order/${orderId}") {
            name
            number
            lineItems(first: 10) {
              nodes {
                id
                name             
                image {
                  url
                }
                quantity
                price{
                  amount
                  currencyCode
                }
              }
            }
            fulfillments(first: 1) {
              nodes {
                latestShipmentStatus
              }
            }
            processedAt
          }
        }`,
      };
      const result = await fetch(
        "shopify://customer-account/api/latest/graphql.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": "789a3ab68ae27b5ce6bf79e8402e4762",
          },
          body: JSON.stringify(orderQuery),
        },
      );

      const { data } = await result.json();
      setOrder(data.order);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  return !loading && Object.keys(order).length > 0 ? (
    <Page
      title={`Order ${order.name}`}
      subtitle={
        order.fulfillments.nodes[0]?.latestShipmentStatus +
        " " +
        formatDate(order.processedAt)
      }
      secondaryAction={
        <Button
          onPress={() => {
            go(-1);
          }}
        >
          Button
        </Button>
      }
    >
      <BlockStack inlineAlignment="center">
        <Text size="extraLarge">What would you like to return?</Text>
        <ChoiceList
          name="choiceMultiple"
          value={selected}
          onChange={(value: string[]) => setSelected(value)}
        >
          <BlockStack minInlineSize={600} inlineAlignment="center">
            {order.lineItems.nodes.map((item) => (
              <Card padding key={item.id}>
                <Choice id={item.id} >
                  <InlineLayout columns={["20%", "fill"]}>
                    <Image source={item.image.url} aspectRatio={1} />
                    <BlockStack>
                      <Text size="medium">{item.name}</Text>
                      <Text size="base">{formatMoney(item.price)}</Text>
                    </BlockStack>
                  </InlineLayout>
                </Choice>
              </Card>
            ))}
          </BlockStack>
        </ChoiceList>
      </BlockStack>
    </Page>
  ) : (
    <BlockStack inlineAlignment="center">
      <Spinner />
    </BlockStack>
  );
}
