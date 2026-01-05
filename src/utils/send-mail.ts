export const sendMail = async (
  strapi: any,
  args: {
    to: string;
    from: string;
    subject: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
    text: string;
    html: string;
  }
) => {
  await strapi.plugins["email"].services.email.send({
    to: args.to,
    from: args.from, // e.g., your verified sender address
    cc: args.cc, // optional
    bcc: args.bcc, // optional
    replyTo: args.replyTo, // optional
    subject: args.subject,
    text: args.text,
    html: args.html,
  });
};
