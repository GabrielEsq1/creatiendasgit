"use client";

import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    recipientId: string;
    conversationId: string;
}

export default function PaymentModal({
    isOpen,
    onClose,
    recipientName,
    recipientId,
    conversationId,
}: PaymentModalProps) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (amountNum > 10000) {
            setError('Maximum amount is $10,000');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/chat/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId,
                    amount: amountNum.toFixed(2),
                    conversationId,
                    note,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create payment');
            }

            if (data.approvalUrl) {
                // Redirect to PayPal
                window.location.href = data.approvalUrl;
            } else {
                throw new Error('No approval URL returned');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Failed to create payment');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Send Money</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Recipient */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Send to
                        </label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                            {recipientName}
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (USD)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="10000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    </div>

                    {/* Note (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note (optional)
                        </label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What's this for?"
                            maxLength={100}
                            disabled={loading}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Info */}
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                        💡 You'll be redirected to PayPal to complete this payment securely.
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H8.29c-.497 0-.863-.453-.752-.936l.002-.01 1.254-7.946a.803.803 0 01.793-.679h2.557c3.738 0 6.308-1.522 7.14-5.123.362-1.578.14-2.88-.72-3.735-.346-.344-.78-.62-1.293-.83l-.257-.09a6.023 6.023 0 00-2.045-.35H9.577a.804.804 0 00-.794.679L7.296 14.41a.803.803 0 01-.793.679h-2.22c-.497 0-.863-.453-.752-.936l.002-.01L5.67 3.185A.803.803 0 016.464 2.5h7.043c1.398 0 2.55.183 3.476.556 1.22.493 2.133 1.426 2.67 2.726l.414.696z" />
                                    </svg>
                                    Send via PayPal
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
