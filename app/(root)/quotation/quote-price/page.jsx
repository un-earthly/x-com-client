import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Quote</CardTitle>
                <CardDescription>Enter your quote details below to submit.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg border d-flex items-center justify-center">
                    <img
                        alt="Product image"
                        className="rounded-lg"
                        height="80"
                        src="/placeholder.svg"
                        style={{
                            aspectRatio: "80/80",
                            objectFit: "cover",
                        }}
                        width="80"
                    />
                </div>
                <div className="grid grid-cols-2 w-full gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Acme Corporation" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="john@example.com" type="email" />
                    </div>
                </div>
            </CardContent>
            <CardContent className="grid grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" placeholder="$" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" placeholder="0" type="number" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="delivery">Delivery (days)</Label>
                    <Input id="delivery" placeholder="0" type="number" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button>Submit</Button>
            </CardFooter>
        </Card>
    )
}