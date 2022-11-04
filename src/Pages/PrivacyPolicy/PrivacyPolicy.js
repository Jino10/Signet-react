import React from 'react';
import { Col, Container } from 'react-bootstrap';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <Container fluid className="lognWrapper">
      <Col lg={12} md={12} sm={12} xs={12}>
        <div className="rightBox d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center flex-column">
            <img className="logo" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/logo.png'} alt="" />
            <h2 className="policyTiltle">Privacy Policy SIGNET Website & Mobile App</h2>
            <h3 className="subTitle">Privacy</h3>
            <p className="policy">
              Your use of www.SIGNET.com and the SIGNET Mobile App is subject to SIGNET Privacy Policy Please review our Privacy
              Policy, which also governs the Site and informs users of our data collection practices.
            </p>
            <h3 className="subTitle">Electronic Communications</h3>
            <p className="policy">
              Visiting{' '}
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>
              , using the mobile app, or sending emails to SIGNET constitutes electronic communications. You consent to receive
              electronic communications and you agree that all agreements, notices, disclosures, and other communications that we
              provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be
              in writing.
            </p>
            <h3 className="subTitle">Your Account</h3>
            <p className="policy">
              If you use this site or Mobile application, you are responsible for maintaining the confidentiality of your account
              and password and for restricting access to your computer, and you agree to accept responsibility for all activities
              that occur under your account or password. You may not assign or otherwise transfer your account to any other person
              or entity. You acknowledge that SIGNET is not responsible for third party access to your account that results from
              theft or misappropriation of your account. SIGNET and its associates reserve the right to refuse or cancel service,
              terminate accounts, or remove or edit content in our sole discretion.
            </p>
            <h3 className="subTitle">Children Under Thirteen</h3>
            <p className="policy">
              SIGNET does not knowingly collect, either online or offline, personal information from persons under the age of
              thirteen. If you are under 18, you may use{' '}
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>{' '}
              or the SIGNET mobile app only with permission of a parent or guardian.
            </p>
            <h3 className="subTitle">Cancellation/Refund Policy</h3>
            <p className="policy">All sales are final.</p>
            <h3 className="subTitle">Links to Third Party Sites/Third Party Services</h3>
            <p className="policy">
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>{' '}
              and the SIGNET mobile app may contain links to other websites (&quot;Linked Sites&quot;). The Linked Sites are not
              under the control of SIGNET and SIGNET is not responsible for the contents of any Linked Site, including without
              limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. SIGNET is providing
              these links to you only as a convenience, and the inclusion of any link does not imply endorsement by SIGNET of the
              site or any association with its operators.
              <br />
              <br />
              Certain services made available via www.SIGNET.com are delivered by third party sites and organizations. By using
              any product, service or functionality originating from the www.SIGNET.com domain, you hereby acknowledge and consent
              that SIGNET may share such information and data with any third party with whom SIGNET has a contractual relationship
              to provide the requested product, service, or functionality on behalf of www.signetgroup.net users and customers.
            </p>
            <h3 className="subTitle">No Unlawful or Prohibited Use/Intellectual Property</h3>
            <p className="policy">
              You are granted a non-exclusive, non-transferable, revocable license to access and use{' '}
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>{' '}
              and the SIGNET mobile app strictly in accordance with these terms of use. As a condition of your use of the Site,
              you warrant to SIGNET that you will not use the Site for any purpose that is unlawful or prohibited by these Terms.
              You may not use the Site in any manner which could damage, disable, overburden, or impair the Site or interfere with
              any other party&apos;s use and enjoyment of the Site. You may not obtain or attempt to obtain any materials or
              information through any means not intentionally made available or provided for through the Site.
              <br />
              <br />
              All content included as part of the Service, such as text, graphics, logos, images, as well as the compilation
              thereof, and any software used on the Site, is the property of SIGNET or its suppliers and protected by copyright
              and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all
              copyright and other proprietary notices, legends or other restrictions contained in any such content and will not
              make any changes thereto.
              <br />
              <br />
              You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative
              works, or in any way exploit any of the content, in whole or in part, found on the Site. SIGNET content is not for
              resale. Your use of the Site does not entitle you to make any unauthorized use of any protected content, and in
              particular you will not delete or alter any proprietary rights or attribution notices in any content. You will use
              protected content solely for your personal use and will make no other use of the content without the express written
              permission of SIGNET and the copyright owner. You agree that you do not acquire any ownership rights in any
              protected content. We do not grant you any licenses, express or implied, to the intellectual property of SIGNET or
              our licensors except as expressly authorized by these Terms.
            </p>
            <h3 className="subTitle">International Users</h3>
            <p className="policy">
              The Service is controlled, operated, and administered by SIGNET from our offices within the USA. If you access the
              Service from a location outside the USA, you are responsible for compliance with all local laws. SIGNET is currently
              not available for, or intended for, use outside of the United States. You agree that you will not use the SIGNET
              Content accessed through{' '}
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>{' '}
              and the SIGNET mobile app in any country outside of the USA or in any manner prohibited by any applicable laws,
              restrictions, or regulations.
            </p>
            <h3 className="subTitle">Indemnification</h3>
            <p className="policy">
              You agree to indemnify, defend and hold harmless SIGNET, its officers, directors, employees, agents and third
              parties, for any losses, costs, liabilities and expenses (including reasonable attorney&apos;s fees) relating to or
              arising out of your use of or inability to use the Site or services, any user postings made by you, your violation
              of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable
              laws, rules or regulations. SIGNET reserves the right, at its own cost, to assume the exclusive defense and control
              of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with SIGNET in
              asserting any available defenses.
            </p>
            <h3 className="subTitle">Arbitration</h3>
            <p className="policy">
              In the event the parties are not able to resolve any dispute between them arising out of or concerning these Terms
              and Conditions, or any provisions hereof, whether in contract, tort, or otherwise at law or in equity for damages or
              any other relief, then such dispute shall be resolved only by final and binding arbitration pursuant to the Federal
              Arbitration Act, conducted by a single neutral arbitrator and administered by the American Arbitration Association,
              or a similar arbitration service selected by the parties, in a location mutually agreed upon by the parties. The
              arbitrator&apos;s award shall be final, and judgment may be entered upon it in any court having jurisdiction. In the
              event that any legal or equitable action, proceeding or arbitration arises out of or concerns these Terms and
              Conditions, the prevailing party shall be entitled to recover its costs and reasonable attorney&apos;s fees. The
              parties agree to arbitrate all disputes and claims in regard to these Terms and Conditions or any disputes arising
              as a result of these Terms and Conditions, whether directly or indirectly, including Tort claims that are a result
              of these Terms and Conditions. The parties agree that the Federal Arbitration Act governs the interpretation and
              enforcement of this provision. The entire dispute, including the scope and enforceability of this arbitration
              provision shall be determined by the Arbitrator. This arbitration provision shall survive the termination of these
              Terms and Conditions.
            </p>
            <h3 className="subTitle">Class Action Waiver</h3>
            <p className="policy">
              Any arbitration under these Terms and Conditions will take place on an individual basis; class arbitrations and
              class/representative/collective actions are not permitted. THE PARTIES AGREE THAT A PARTY MAY BRING CLAIMS AGAINST
              THE OTHER ONLY IN EACH&apos;S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PUTATIVE CLASS,
              COLLECTIVE AND/ OR REPRESENTATIVE PROCEEDING, SUCH AS IN THE FORM OF A PRIVATE ATTORNEY GENERAL ACTION AGAINST THE
              OTHER. Further, unless both you and SIGNET agree otherwise, the arbitrator may not consolidate more than one
              person&apos;s claims and may not otherwise preside over any form of a representative or class proceeding.
            </p>
            <h3 className="subTitle">Liability Disclaimer</h3>
            <p className="policy">
              THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES
              OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. SIGNET, INC. AND/OR ITS SUPPLIERS
              MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.
              <br />
              <br />
              SIGNET, INC. AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY,
              TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE
              FOR ANY PURPOSE. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE, PRODUCTS,
              SERVICES AND RELATED GRAPHICS ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OR CONDITION OF ANY KIND. SIGNET, INC.
              AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION, SOFTWARE,
              PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
              <br />
              <br />
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SIGNET, INC. AND/OR ITS SUPPLIERS BE LIABLE FOR
              ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING,
              WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR
              PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR
              FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED
              THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE,
              STRICT LIABILITY OR OTHERWISE, EVEN IF SIGNET, INC. OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF
              DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL
              OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE
              SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.
            </p>
            <h3 className="subTitle">Termination/Access Restriction</h3>
            <p className="policy">
              SIGNET reserves the right, in its sole discretion, to terminate your access to the Site and the related services or
              any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed
              by the laws of the State of Massachusetts, and you hereby consent to the exclusive jurisdiction and venue of courts
              in Maine in all disputes arising out of or relating to the use of the Site. Use of the Site is unauthorized in any
              jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this
              section.
              <br />
              <br />
              You agree that no joint venture, partnership, employment, or agency relationship exists between you and SIGNET as a
              result of this agreement or use of the Site. SIGNET&apos;s performance of this agreement is subject to existing laws
              and legal process, and nothing contained in this agreement is in derogation of SIGNET&apos;s right to comply with
              governmental, court and law enforcement requests or requirements relating to your use of the Site or information
              provided to or gathered by SIGNET with respect to such use. If any part of this agreement is determined to be
              invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and
              liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a
              valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the
              agreement shall continue in effect.
              <br />
              <br />
              Unless otherwise specified herein, this agreement constitutes the entire agreement between the user and SIGNET with
              respect to the Site and it supersedes all prior or contemporaneous communications and proposals, whether electronic,
              oral, or written, between the user and SIGNET with respect to the Site. A printed version of this agreement and of
              any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or
              relating to this agreement to the same extent and subject to the same conditions as other business documents and
              records originally generated and maintained in printed form. It is the express wish to the parties that this
              agreement and all related documents be written in English.
            </p>
            <h3 className="subTitle">Changes to Terms</h3>
            <p className="policy">
              SIGNET reserves the right, in its sole discretion, to change the Terms under which{' '}
              <a href="www.signetgroup.net" target="_blank" rel="noopener noreferrer" className="primaryColorLink">
                www.signetgroup.net
              </a>{' '}
              and the SIGNET mobile app is offered. The most current version of the Terms will supersede all previous versions.
              SIGNET encourages you to periodically review the Terms to stay informed of our updates.
            </p>
            <h3 className="subTitle">Contact Us</h3>
            <p className="policy">SIGNET welcomes your questions or comments regarding the Terms:</p>
            <ul className="address">
              <li>
                Contact{' '}
                <a
                  href="https://signetgroup.net/contact-us/?subject=General+Information"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primaryColorLink"
                >
                  https://signetgroup.net/contact-us/?subject=General+Information
                </a>
              </li>
              <li>Mail: SIGNET, Inc.</li>
              <li className="listBold">Corporate Headquarters</li>
              <li className="listStyle-none">SIGNET Electronic Systems, Inc.</li>
              <li className="listStyle-none">90 Longwater Drive</li>
              <li className="listStyle-none">Norwell, MA 02061</li>
              <li className="listBold listStyle-none">Phone: 781-871-5888</li>
              <li className="listBold listStyle-none">Fax: 781-871-4757</li>
            </ul>
            <p className="policy">Effective as of June 01, 2022</p>
            <br />
            <br />
          </div>
        </div>
      </Col>
    </Container>
  );
}

export default PrivacyPolicy;
