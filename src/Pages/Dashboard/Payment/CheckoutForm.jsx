import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useCart from "../../../Hooks/useCart";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaStripe } from "react-icons/fa";

const CheckoutForm = () => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, refetch] = useCart();
    const totalPrice = cart.reduce( (total, item) => total + item.price , 0)

    useEffect( () => {
        if(totalPrice > 0){
            axiosSecure.post('/create-payment-intent', { price: totalPrice })
            .then(res => {
                console.log(res.data.clientSecret);
                setClientSecret(res.data.clientSecret);
            })
        }
    } , [axiosSecure, totalPrice])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!stripe || !elements){
            return;
        }

        const card = elements.getElement(CardElement);
        if(card == null){
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if(error){
            console.log('Payment Error', error);
            setError(error.message);
        }else{
            console.log('Payment Method', paymentMethod);
            setError('');
        }

        // confirm payment 
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        })

        if(confirmError){
            console.log('Confirm Error');
        }else{
            console.log('Payment Intent', paymentIntent);
            if(paymentIntent.status === 'succeeded'){
                console.log('Transaction ID', paymentIntent.id);
                setTransactionId(paymentIntent.id);

                //Now Save the payment in the database
                const payment = {
                    email: user?.email,
                    price: totalPrice,
                    transactionId: paymentIntent.id,
                    date: new Date(),
                    cartIds: cart.map(item => item._id),
                    menuItemIds: cart.map(item => item.menuId),
                    status: 'pending'
                }

                const res = await axiosSecure.post('/payments', payment);
                console.log('payment saved', res.data);
                refetch();
                if (res.data?.paymentResult?.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Thank you for the Payment",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/dashboard/paymentHistory')
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            ></CardElement>
            <button className="btn btn-sm btn-primary my-4" type="submit" disabled={!stripe || !clientSecret}>
                <FaStripe className="text-2xl"></FaStripe> Pay 
            </button>
            <p className="text-red-600">{error}</p>
            {transactionId && <p className="text-green-600"> Your transaction id: {transactionId}</p>}
            
        </form>
    );
};

export default CheckoutForm;