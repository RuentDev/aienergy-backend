export const subjectString = (user?: any) => {
  return `Welcome to AI Energy Shop`;
};

export const registerUserEmailTemplate = (data?: { [key: string]: string }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pending Approval</title>
        <style>
          body {
            font-family: arial, helvetica neue, helvetica, sans-serif;
            background: #f7ecda;
          }
          a {
            color: #29294c;
          }
          .contentbox {
            width: 98%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            background: white;
          }
          @media only screen and (max-width: 480px) {
            .nomobile {
              display: none;
            }
            .showmobiletable {
              display: table !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="contentbox">
            <div>
                <table width="100%">
                  <tr class="nomobile">
                    <td style="text-align: left; padding-left:1.5em; width:50%;vertical-align:top">
                      📞 <a href="tel:1300768089">1300 768 089</a>
                    </td>
                    <td style="text-align: right; padding-right:1.5em; width:50%;vertical-align:top">
                      🔗 <a href="${process.env.CLIENT_HOST_URL}" target="_blank">aienergyshop.com.au</a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center">
                      <a href="${process.env.CLIENT_HOST_URL}">
                        <img src="https://aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com/strapi-staging/AES_Logo_750px_e53144771c.png" width="200px">
                      </a>
                    </td>
                  </tr>
                </table>
            <div>
              <table style="display:none; margin-top:0.25em" width="100%" class="showmobiletable">
                <tr>
                  <td style="text-align: center;width:100%;vertical-align:top">📞 <a href="tel:1300768089">1300 768 089</a></td>
                </tr>
              </table>
              </div>
            <div>
            <table style="display:none; margin-top:0.25em" width="100%" class="showmobiletable">
              <tr align="center">
                <td>
                  <img src="https://aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com/strapi-staging/AES_Email_Sig_Bar_de41b5771d.png" width="596px" height="3px" style="width:98%; margin:1%; height:3px">
                </td>
              </tr>
            </table>
            <div style="margin:1.25em">
              <table>
                <tr>
                  <td>
                    <h3>Thank You for Registering With AI&nbsp;Energy&nbsp;Shop</h3>
                    <p>Hi ${data?.username},</p>
                    <p>Thank you for creating an account with AI&nbsp;Energy&nbsp;Shop.</p>
                    <p>Your account is currently being approved. Please allow 2&nbsp;&#8209;&nbsp;4&nbsp;hours within our office hours for account approval to be completed.</p>
                    <p>You will receive another email after your account has been approved, after which you can login online. With this account, you will be able to access our full range of products with wholesaler exclusive pricing, promotions, and bulk discounts.</p>
                    <p>Thank you again,  should you have any questions or are after an update on your account status please don't hesitate to <a href="${process.env.CLIENT_HOST_URL}/contact">contact us</a>.</p>
                    <p style="margin-bottom: 1em;"><i>From the AI Energy Shop Team</i></p>
                  </td>
                </tr>
                <tr><td align="center" style="border-top:2px solid #29294c"><p style="font-size:0.8em;margin-top:0.5em;margin-bottom: 0.5em;">AI&nbsp;Energy&nbsp;Shop | ABN: 35&nbsp;651&nbsp;990&nbsp;831 </p></td></tr>
              </table>
            </div>
            </div>
        </div>
      </body>
    </html>
  `;
};

export const approvedUserEmailTemplate = (data?: { [key: string]: string }) => {
  return `
<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Approved</title>
        <style>
          body {
            font-family: arial, helvetica neue, helvetica, sans-serif;
            background: #f7ecda;
          }
          a {
            color: #29294c;
          }

          .bar {
            width: 100%;
            margin: 5px 0;
            height: 3px;
            background: linear-gradient(90deg,rgba(247, 181, 57, 1) 0%, rgba(229, 14, 103, 1) 49%, rgba(105, 38, 80, 1) 100%);
          }
          .contentbox {
            width: 98%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            background: white;
          }
          @media only screen and (max-width: 480px) {
            .nomobile {
              display: none;
            }
            .showmobiletable {
              display: table !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="contentbox">
          <div>
            <table width="100%">
              <tr class="nomobile">
                <td style="text-align: left; padding-left:1.5em; width:50%;vertical-align:top">
                  📞 <a href="tel:1300768089">1300 768 089</a>
                </td>
              <td style="text-align: right; padding-right:1.5em; width:50%;vertical-align:top">
                🔗 <a href="${process.env.CLIENT_HOST_URL}" target="_blank">aienergyshop.com.au</a>
              </td>
            </tr>
            <td colspan="2" align="center">
              <a href="${process.env.CLIENT_HOST_URL}">
                <img src="${process.env.CLIENT_LOGO_URL}" width="200px">
              </a>
            </td>
            </table>
            <table style="display:none; margin-top:0.25em" width="100%" class="showmobiletable">
              <tr>
                <td style="text-align: center;width:100%;vertical-align:top">📞 <a href="tel:1300768089">1300 768 089</a></td>
              </tr>
            </table>
          </div>
          <table style="display:table; margin-top:0.25em" width="100%">
            <tr align="center">
              <td>
                <div class="bar"> <div/>
              </td>
            </tr>
          </table>
          <div style="margin:1.25em">
              <table>
                  <tr>
                    <td>
                      <h3>Your AI&nbsp;Energy&nbsp;Shop account has now been approved</h3>
                      <p>Hi ${data?.username},</p>
                      <p>Your online account with AI&nbsp;Energy&nbsp;Shop has now been approved.</p>
                      <p>You can now log in to your account and view exclusive pricing, stock levels and easily submit orders from your local warehouse.</p>
                      <p>Your account details are as follows:</p>
                      <p style="margin-left:1.5em">
                        Username: ${data?.username}
                        <br>
                        Email: ${data?.email}
                        <br>
                        Business: ${data?.business_name}
                        <br>
                        ABN: ${data?.business_number}
                      </p>
                      <p>
                        Should you need to change any of these details please 
                        <a href="${process.env.CLIENT_HOST_URL}/shift-trade">
                          online here
                        </a>, or if you already have an account with Shift <a href="${process.env.CLIENT_HOST_URL}/contact">contact us</a> and we will have them updated.
                      </p>
                      <p>We also offer account credit in partnership with Shift Trade. If you are interested in applying for account credit with Shift to use with AI&nbsp;Energy&nbsp;Shop, you can do so <a href="${process.env.CLIENT_HOST_URL}/shift-trade">online here</a>, or if you already have an account with Shift <a href="${process.env.CLIENT_HOST_URL}/contact">let us know</a> and we can get it connected.</p>
                      <p style="margin-bottom: 1em;"><i>From the AI Energy Shop Team</i></p>
                    </td>
                </tr>
                <tr>
                  <td align="center" style="border-top:2px solid #29294c">
                    <p style="font-size:0.8em;margin-top:0.5em;margin-bottom: 0.5em;">
                      AI&nbsp;Energy&nbsp;Shop | ABN: 35&nbsp;651&nbsp;990&nbsp;831 
                    </p>
                  </td>
                </tr>
              </table>
          </div>
      </body>
    </html>
  `;
};

export const internalWaitingForApprovalEmailTemplate = (data?: {
  [key: string]: string;
}) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Waiting For Approval</title>

        <style>
          body {
            font-family: arial, helvetica neue, helvetica, sans-serif;
            background: #f7ecda;
          }
          a {
            color: #29294c;
          }
          .contentbox {
            width: 98%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            background: white;
          }
          @media only screen and (max-width: 480px) {
            .nomobile {
              display: none;
            }
            .showmobiletable {
              display: table !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="contentbox">
          <div>
            <table width="100%">
              <tr class="nomobile">
                <td
                  style="
                    text-align: left;
                    padding-left: 1.5em;
                    width: 50%;
                    vertical-align: top;
                  "
                >
                  📞 <a href="tel:1300768089">1300 768 089</a>
                </td>
                <td
                  style="
                    text-align: right;
                    padding-right: 1.5em;
                    width: 50%;
                    vertical-align: top;
                  "
                >
                  🔗
                  <a href="${process.env.CLIENT_HOST_URL}" target="_blank"
                    >aienergyshop.com.au</a
                  >
                </td>
              </tr>
              <td colspan="2" align="center">
                <a href="${process.env.CLIENT_HOST_URL}"
                  ><img
                    src="https://files.aienergyshop.com.au/images/AES-Logo_750px.png"
                    width="200px"
                /></a>
              </td>
            </table>
            <div>
              <table
                style="display: none; margin-top: 0.25em"
                width="100%"
                class="showmobiletable"
              >
                <tr>
                  <td style="text-align: center; width: 100%; vertical-align: top">
                    📞 <a href="tel:1300768089">1300 768 089</a>
                  </td>
                </tr>
              </table>
            </div>
            <div>
              <table style="display: table; margin-top: 0.25em" width="100%">
                <tr align="center">
                  <td>
                    <img
                      src="https://aienergyshop.com.au/images/AES-Email-Sig-Bar.png"
                      width="596px"
                      height="3px"
                      style="width: 98%; margin: 1%; height: 3px"
                    />
                  </td>
                </tr>
              </table>
              <div style="margin: 1.25em">
                <table>
                  <tr>
                    <td>
                      <h3>
                        An AI&nbsp;Energy&nbsp;Shop account is waiting for approval
                      </h3>
                      <p>Hi,</p>
                      <p>
                        A new AI&nbsp;Energy&nbsp;Shop has been created at ${new Date(data?.created_at).toLocaleString()} and is waiting for approval.
                      </p>
                      <p>The account details are as follows:</p>
                      <p style="margin-left: 1.5em">
                        Username: ${data?.username}
                        <br />
                        Email: ${data?.email}
                        <br />
                        Business: ${data?.business_name}
                        <br />
                        ABN: ${data?.business_number}
                      </p>
                      <p style="margin-bottom: 1em">
                        Please review the full account details in
                        <a href="${process.env.CLIENT_HOST_URL}/admin/users/${data?.documentId}">
                          the control panel
                        </a>
                        and process the account creation request.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="border-top: 2px solid #29294c">
                      <p
                        style="
                          font-size: 0.8em;
                          margin-top: 0.5em;
                          margin-bottom: 0.5em;
                        "
                      >
                        AI&nbsp;Energy&nbsp;Shop | ABN:
                        35&nbsp;651&nbsp;990&nbsp;831
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
