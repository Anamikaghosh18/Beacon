// All user-facing copy is written for non-technical business users.
// Think: a marketing manager, brand owner, or founder — not an engineer.

export const MOCK_KPIS = {
  totalCustomers: 50241,
  activeSegments: 14,
  campaignsSent: 342,
  revenueInfluenced: 1240500,
};

export const CAMPAIGN_FUNNEL = [
  { name: 'Sent', value: 125000 },
  { name: 'Delivered', value: 120000 },
  { name: 'Opened', value: 45000 },
  { name: 'Clicked', value: 12000 },
  { name: 'Bought', value: 3400 },
];

export const RECENT_CAMPAIGNS = [
  { id: 'c1', name: 'Win them back', audience: 'Customers who went quiet', channel: 'Email', status: 'Running', revenue: '$12,400' },
  { id: 'c2', name: 'Holiday Special Offer', audience: 'Best customers', channel: 'Push Notification', status: 'Completed', revenue: '$45,000' },
  { id: 'c3', name: 'New Feature Announcement', audience: 'Everyone active', channel: 'In-App', status: 'Draft', revenue: '—' },
  { id: 'c4', name: 'Left something in the cart?', audience: 'Big spenders', channel: 'SMS', status: 'Running', revenue: '$8,200' },
];

export const AI_INSIGHTS = [
  {
    id: 1,
    text: "More customers than usual haven't come back this week — about 12% more than last week.",
    recommendation: "Now is a great time to send a friendly message to customers you haven't heard from in a while. A small discount or personal note goes a long way.",
  },
  {
    id: 2,
    text: "Your best customers are opening push notifications 5% less often than before.",
    recommendation: "Try sending your best customers messages at a different time of day. Sometimes a small change in timing makes a big difference.",
  }
];

export const SEGMENTS = [
  { id: 's1', name: 'Your Best Buyers',        size: 1240, revenue: '$450k', trend: '+12%', desc: 'Customers who buy often and spend the most.' },
  { id: 's2', name: 'Gone Quiet',              size: 8400, revenue: '$20k',  trend: '-2%',  desc: 'Customers who haven\'t visited or purchased in 90+ days.' },
  { id: 's3', name: 'Just Joined',             size: 3200, revenue: '$80k',  trend: '+25%', desc: 'New customers who signed up in the last 30 days.' },
  { id: 's4', name: 'Might Be Losing Them',   size: 1500, revenue: '$150k', trend: '+5%',  desc: 'Customers showing signs of disengagement. Act soon.' },
  { id: 's5', name: 'VIP Members',             size: 450,  revenue: '$200k', trend: '+8%',  desc: 'Loyal top-tier customers who deserve special attention.' },
];

export const EVENT_STREAM = [
  { id: 'e1', type: 'Sale Recorded',        campaign: 'Holiday Special Offer',          user: 'Priya M.',   time: 'Just now' },
  { id: 'e2', type: 'Link Clicked',         campaign: 'Holiday Special Offer',          user: 'Rahul S.',   time: '2 mins ago' },
  { id: 'e3', type: 'Message Opened',       campaign: 'Win them back',                  user: 'Anita K.',   time: '5 mins ago' },
  { id: 'e4', type: 'Message Delivered',    campaign: 'Win them back',                  user: 'James T.',   time: '12 mins ago' },
  { id: 'e5', type: 'Message Sent',         campaign: 'Win them back',                  user: 'Maria L.',   time: '15 mins ago' },
  { id: 'e6', type: 'Campaign Started',     campaign: 'New Feature Announcement',       user: 'You',        time: '1 hour ago' },
];
