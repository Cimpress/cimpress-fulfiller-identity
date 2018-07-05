/**
 * Objects of fulfiller class are either required or returned by the methods of the FulfillerIdentityClient.
 */
class FulfillerContact {
  constructor(id, createdAt, createdBy, defaultContact, email, language, name, phone, technicalContact, links) {
    this._id = id;
    this._createdAt = createdAt;
    this._createdBy = createdBy;
    this._defaultContact = defaultContact;
    this._email = email;
    this._language = language;
    this._name = name;
    this._phone = phone;
    this._technicalContact = technicalContact;
    this._links = links;
  }

  /**
   * Returns the contact id.
   * @returns {*}
   */
  get id() {
    return this._id;
  }

  /**
   * Returns when the contact was created
   * @returns {*}
   */
  get createdAt() {
    return this._createdAt;
  }

  /**
   * Returns the name of the creator of the contact
   * @returns {*}
   */
  get createdBy() {
    return this._createdBy;
  }

   /**
   * Returns if the contact is default or not
   * @returns {*}
   */
  get defaultContact() {
    return this._defaultContact;
  }

  /**
   * Changes the defaultContact to true or false.
   * @param value
   */
  set defaultContact(value) {
    this._defaultContact = value;
  }

  /**
   * Returns if the contact is technical or not
   * @returns {*}
   */
  get technicalContact() {
    return this._technicalContact;
  }

  /**
   * Changes if the contact is technical or not
   * @param value
   */
  set technicalContact(value) {
    this._technicalContact = value;
  }

   /**
   * Returns the name of the fulfiller.
   * @returns {*}
   */
  get name() {
    return this._name;
  }


  /**
   * Changes the name of the fulfiller in the object.
   * @param value
   */
  set name(value) {
    this._name = value;
  }

  /**
   * Returns the fufliller contact point email address.
   * @returns {*}
   */
  get email() {
    return this._email;
  }

  /**
   * Sets the fuliller contact point email address in the object.
   * @param value
   */
  set email(value) {
    this._email = value;
  }

  /**
   * Gets the fulfiller contact point phone number.
   * @returns {*}
   */
  get phone() {
    return this._phone;
  }

  /**
   * Sets the fulfiller contact point phone number in the object.
   * @param value
   */
  set phone(value) {
    this._phone = value;
  }

  /***
   * Gets the fulfiller perferred language
   * @returns {*}
   */
  get language() {
    return this._language;
  }

  /**
   * Sets the fulfiller preferred language in the object.
   * @param value
   */
  set language(value) {
    this._language = value;
  }

 
  getContactUrl() {
    return this._links && this._links.self ? this._links.self.href : null;
  }

  getFulfillerUrl() {
    return this._links && this._links.fulfiller ? this._links.fulfiller.href : null;
  }
  
  toJSON() {
    return {
      id: this._id,
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      defaultContact: this._defaultContact,
      email: this._email,
      language: this._language,
      name: this._name,
      phone: this._phone,
      technicalContact: this._technicalContact
    };
  }
}

module.exports = FulfillerContact;