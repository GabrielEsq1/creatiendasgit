"use client";

import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentMessageProps {
    payment: {
        paymentId: string;
        amount: number;
        currency: string;
        status: 'pending' | 'completed' | 'failed';
        recipientId: string;
        senderId: string;
        note?: string;
        capturedAt?: string;
    };
    isSender: boolean;
    senderName?: string;
    recipientName?: string;
    timestamp: Date;
}

export default function PaymentMessage({
    payment,
    isSender,
    senderName,
    recipientName,
    timestamp,
}: PaymentMessageProps) {
    const statusConfig = {
        completed: {
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            label: 'Completed',
        },
        pending: {
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            label: 'Pending',
        },
        failed: {
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            label: 'Failed',
        },
    };

    const config = statusConfig[payment.status];
    const StatusIcon = config.icon;

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-sm rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-4 shadow-sm`}
            >
                {/* Header with PayPal Icon */}
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H8.29c-.497 0-.863-.453-.752-.936l.002-.01 1.254-7.946a.803.803 0 01.793-.679h2.557c3.738 0 6.308-1.522 7.14-5.123.362-1.578.14-2.88-.72-3.735-.346-.344-.78-.62-1.293-.83l-.257-.09a6.023 6.023 0 00-2.045-.35H9.577a.804.804 0 00-.794.679L7.296 14.41a.803.803 0 01-.793.679h-2.22c-.497 0-.863-.453-.752-.936l.002-.01L5.67 3.185A.803.803 0 016.464 2.5h7.043c1.398 0 2.55.183 3.476.556 1.22.493 2.133 1.426 2.67 2.726l.414.696z" />
                    </svg>
                    <span className="font-semibold text-gray-900">PayPal Payment</span>
                </div>

                {/* Amount */}
                <div className="mb-3">
                    <div className="text-3xl font-bold text-gray-900">
                        ${payment.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">{payment.currency}</div>
                </div>

                {/* Sender/Recipient Info */}
                <div className="space-y-1 mb-3 text-sm">
                    {isSender ? (
                        <div className="text-gray-700">
                            <span className="font-medium">To:</span> {recipientName || 'Recipient'}
                        </div>
                    ) : (
                        <div className="text-gray-700">
                            <span className="font-medium">From:</span> {senderName || 'Sender'}
                        </div>
                    )}
                </div>

                {/* Note */}
                {payment.note && (
                    <div className="mb-3 px-3 py-2 bg-white bg-opacity-50 rounded text-sm text-gray-700 italic">
                        "{payment.note}"
                    </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className={`flex items-center gap-1 ${config.color} font-medium text-sm`}>
                        <StatusIcon className="w-4 h-4" />
                        <span>{config.label}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date(timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </div>
                </div>

                {/* Transaction ID (small print) */}
                <div className="mt-2 text-xs text-gray-400 truncate">
                    ID: {payment.paymentId.substring(0, 20)}...
                </div>
            </div>
        </div>
    );
}
